import { DDataStructure, type DCommon, type DKind, type ExpectType } from "@scripts";

describe("createType", () => {
	it("checks the fundamental type before delegating to the type implementation", () => {
		const fundamentalSymbol = Symbol("test-string");
		const testTypeKind = DDataStructure.createKind("test-type");

		interface TestFundamentalType extends DDataStructure.FundamentalType<
			typeof fundamentalSymbol,
			string
		> {}

		const fundamentalTypeExecuteCheck = vi.fn(
			(
				self: TestFundamentalType,
				data: unknown,
				errorHandler?: DDataStructure.GetErrorHandler,
			) => typeof data === "string"
				? DDataStructure.SuccessSymbol
				: errorHandler?.().addIssue(self, data) ?? DDataStructure.ErrorSymbol,
		);
		const fundamentalType = DDataStructure.createFundamentalType<TestFundamentalType>(
			fundamentalSymbol,
			fundamentalTypeExecuteCheck,
		);

		interface TestTypeDefinition extends DDataStructure.TypeDefinition {
			readonly literal: "valid";
		}

		interface TestType extends DCommon.UnionToIntersection<
			& DDataStructure.Type<
				typeof fundamentalType,
				"valid",
				TestTypeDefinition
			>
			& DKind.Kind<typeof testTypeKind>
		> {}

		const executeCheck = vi.fn(
			(
				self: TestType,
				data: string,
				errorHandler?: DDataStructure.GetErrorHandler,
			) => data === self.definition.literal
				? DDataStructure.SuccessSymbol
				: errorHandler?.().addIssue(self, data) ?? DDataStructure.ErrorSymbol,
		);
		const isAsynchronous = vi.fn(() => false);

		const TestType = DDataStructure.createType(
			fundamentalType,
			testTypeKind,
			({ init }) => () => init<TestType>(
				{ literal: "valid" },
				{
					executeCheck,
					isAsynchronous,
				},
			),
		);

		const type = TestType();

		type _CheckType = ExpectType<
			typeof type,
			TestType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DDataStructure.TypeValue<typeof type>,
			"valid",
			"strict"
		>;

		expect(type.fundamentalType).toBe(fundamentalType);
		expect(type.definition).toEqual({ literal: "valid" });
		expect(type.executeCheck("valid")).toBe(DDataStructure.SuccessSymbol);
		expect(type.executeCheck("invalid")).toBe(DDataStructure.ErrorSymbol);
		expect(type.executeCheck(123 as never)).toBe(DDataStructure.ErrorSymbol);
		expect(type.isAsynchronous()).toBe(false);
		expect(fundamentalTypeExecuteCheck).toHaveBeenNthCalledWith(
			1,
			fundamentalType,
			"valid",
			undefined,
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			1,
			type,
			"valid",
			undefined,
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			2,
			type,
			"invalid",
			undefined,
		);
		expect(executeCheck).not.toHaveBeenCalledWith(
			type,
			123,
		);
		expect(isAsynchronous).toHaveBeenCalledWith(type);
	});

	it("forwards the error handler to the fundamental type and the type implementation", () => {
		const fundamentalSymbol = Symbol("test-string-error-handler");
		const testTypeKind = DDataStructure.createKind("test-type-error-handler");
		const errorHandler = DDataStructure.createGetErrorHandler();

		interface TestFundamentalType extends DDataStructure.FundamentalType<
			typeof fundamentalSymbol,
			string
		> {}

		const fundamentalTypeExecuteCheck = vi.fn(
			(): DDataStructure.SuccessSymbol => DDataStructure.SuccessSymbol,
		);
		const fundamentalType = DDataStructure.createFundamentalType<TestFundamentalType>(
			fundamentalSymbol,
			fundamentalTypeExecuteCheck,
		);

		interface TestType extends DCommon.UnionToIntersection<
			& DDataStructure.Type<typeof fundamentalType>
			& DKind.Kind<typeof testTypeKind>
		> {}

		const executeCheck = vi.fn(
			(): DDataStructure.SuccessSymbol => DDataStructure.SuccessSymbol,
		);
		const TestType = DDataStructure.createType(
			fundamentalType,
			testTypeKind,
			({ init }) => () => init<TestType>(
				{},
				{
					executeCheck,
					isAsynchronous: () => false,
				},
			),
		);

		const type = TestType();

		expect(type.executeCheck("valid", errorHandler)).toBe(DDataStructure.SuccessSymbol);
		expect(fundamentalTypeExecuteCheck).toHaveBeenCalledWith(
			fundamentalType,
			"valid",
			errorHandler,
		);
		expect(executeCheck).toHaveBeenCalledWith(
			type,
			"valid",
			errorHandler,
		);
	});

	it("preserves asynchronous checks through the fundamental type and implementation", async() => {
		const fundamentalSymbol = Symbol("test-async-string");
		const testTypeKind = DDataStructure.createKind("test-async-type");
		const errorHandler = DDataStructure.createGetErrorHandler();

		interface TestFundamentalType extends DDataStructure.FundamentalType<
			typeof fundamentalSymbol,
			string
		> {}

		const fundamentalTypeExecuteCheck = vi.fn(
			(
				self: TestFundamentalType,
				data: unknown,
				errorHandler?: DDataStructure.GetErrorHandler,
			) => Promise.resolve(typeof data === "string"
				? DDataStructure.SuccessSymbol
				: errorHandler?.().addIssue(self, data) ?? DDataStructure.ErrorSymbol),
		);
		const fundamentalType = DDataStructure.createFundamentalType<TestFundamentalType>(
			fundamentalSymbol,
			fundamentalTypeExecuteCheck,
		);

		interface TestType extends DCommon.UnionToIntersection<
			& DDataStructure.Type<typeof fundamentalType>
			& DKind.Kind<typeof testTypeKind>
		> {}

		const executeCheck = vi.fn(
			(
				self: TestType,
				data: string,
				errorHandler?: DDataStructure.GetErrorHandler,
			) => Promise.resolve(data === "valid"
				? DDataStructure.SuccessSymbol
				: errorHandler?.().addIssue(self, data) ?? DDataStructure.ErrorSymbol),
		);
		const TestType = DDataStructure.createType(
			fundamentalType,
			testTypeKind,
			({ init }) => () => init<TestType>(
				{},
				{
					executeCheck,
					isAsynchronous: () => true,
				},
			),
		);

		const type = TestType();

		await expect(type.executeCheck("valid", errorHandler)).resolves.toBe(
			DDataStructure.SuccessSymbol,
		);
		await expect(type.executeCheck("invalid", errorHandler)).resolves.toBe(
			DDataStructure.ErrorSymbol,
		);
		await expect(type.executeCheck(123, errorHandler)).resolves.toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(fundamentalTypeExecuteCheck).toHaveBeenNthCalledWith(
			1,
			fundamentalType,
			"valid",
			errorHandler,
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			1,
			type,
			"valid",
			errorHandler,
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			2,
			type,
			"invalid",
			errorHandler,
		);
		expect(executeCheck).not.toHaveBeenCalledWith(
			type,
			123,
			errorHandler,
		);
		expect(errorHandler().createError().issues).toHaveLength(2);
	});
});
