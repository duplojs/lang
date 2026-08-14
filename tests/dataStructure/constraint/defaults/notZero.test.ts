import { DDataStructure, type DNumber, type ExpectType } from "@scripts";

describe("NotZeroConstraint", () => {
	it("creates a synchronous non-zero number constraint", () => {
		const constraint = DDataStructure.NotZeroConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.NotZeroConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			number & DNumber.NotZero,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts non-zero numbers", () => {
		const constraint = DDataStructure.NotZeroConstraint();

		expect(constraint.executeCheck(1)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects zero without an error handler", () => {
		const constraint = DDataStructure.NotZeroConstraint();

		expect(constraint.executeCheck(0)).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when zero is rejected", () => {
		const constraint = DDataStructure.NotZeroConstraint();
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(constraint.executeCheck(0, errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(constraint);
	});
});
