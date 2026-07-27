import { DDataStructure, type DCommon, type DKind, type ExpectType } from "@scripts";

describe("createConstraint", () => {
	it("creates a constraint constructor that initializes definitions and delegates checks with itself", () => {
		const testConstraintKind = DDataStructure.createKind("test-constraint");

		interface TestConstraintDefinition extends DDataStructure.ConstraintDefinition {
			readonly min: 3;
		}

		interface TestConstraint extends DCommon.UnionToIntersection<
			& DDataStructure.Constraint<
				string,
				string & { readonly minLength: 3 },
				TestConstraintDefinition
			>
			& DKind.Kind<typeof testConstraintKind>
		> {}

		const executeCheck = vi.fn(
			(
				self: TestConstraint,
				data: string,
				errorHandler?: DDataStructure.GetErrorHandler,
			) => data.length >= self.definition.min
				? DDataStructure.SuccessSymbol
				: errorHandler?.().addIssue(self, data) ?? DDataStructure.ErrorSymbol,
		);
		const isAsynchronous = vi.fn(() => false);

		const TestConstraint = DDataStructure.createConstraint(
			testConstraintKind,
			({ init }) => () => init<TestConstraint>(
				{ min: 3 },
				{
					executeCheck,
					isAsynchronous,
				},
			),
		);

		const constraint = TestConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			TestConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			string & { readonly minLength: 3 },
			"strict"
		>;

		expect(constraint.definition).toEqual({ min: 3 });
		expect(constraint.executeCheck("abc")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("ab")).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.isAsynchronous()).toBe(false);
		expect(executeCheck).toHaveBeenNthCalledWith(
			1,
			constraint,
			"abc",
			undefined,
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			2,
			constraint,
			"ab",
			undefined,
		);
		expect(isAsynchronous).toHaveBeenCalledWith(constraint);
	});

	it("forwards the error handler and preserves asynchronous checks", async() => {
		const testConstraintKind = DDataStructure.createKind("test-async-constraint");
		const errorHandler = DDataStructure.createGetErrorHandler();

		interface TestConstraintDefinition extends DDataStructure.ConstraintDefinition {
			readonly min: number;
		}

		interface TestConstraint extends DCommon.UnionToIntersection<
			& DDataStructure.Constraint<
				string,
				string & { readonly minLength: number },
				TestConstraintDefinition
			>
			& DKind.Kind<typeof testConstraintKind>
		> {}

		const executeCheck = vi.fn(
			(
				self: TestConstraint,
				data: string,
				errorHandler?: DDataStructure.GetErrorHandler,
			) => Promise.resolve(
				data.length >= self.definition.min
					? DDataStructure.SuccessSymbol
					: errorHandler?.().addIssue(self, data) ?? DDataStructure.ErrorSymbol,
			),
		);
		const isAsynchronous = vi.fn(() => true);

		const TestConstraint = DDataStructure.createConstraint(
			testConstraintKind,
			({ init }) => (min: number) => init<TestConstraint>(
				{ min },
				{
					executeCheck,
					isAsynchronous,
				},
			),
		);

		const constraint = TestConstraint(4);

		expect(constraint.definition).toEqual({ min: 4 });
		await expect(
			constraint.executeCheck("abc", errorHandler),
		).resolves.toBe(DDataStructure.ErrorSymbol);
		expect(constraint.isAsynchronous()).toBe(true);
		expect(executeCheck).toHaveBeenCalledWith(
			constraint,
			"abc",
			errorHandler,
		);
		expect(isAsynchronous).toHaveBeenCalledWith(constraint);
		expect(errorHandler().createError().issues).toHaveLength(1);
	});
});
