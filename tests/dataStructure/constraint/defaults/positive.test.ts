import { DDataStructure, type DNumber, type ExpectType } from "@scripts";

describe("PositiveConstraint", () => {
	it("creates a synchronous positive number constraint", () => {
		const constraint = DDataStructure.PositiveConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.PositiveConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.Positive,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts positive numbers and zero", () => {
		const constraint = DDataStructure.PositiveConstraint();

		expect(constraint.executeCheck(1)).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck(0)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects negative numbers without an error handler", () => {
		const constraint = DDataStructure.PositiveConstraint();

		expect(constraint.executeCheck(-1)).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when a negative number is rejected", () => {
		const constraint = DDataStructure.PositiveConstraint();
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(constraint.executeCheck(-1, errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(constraint);
	});
});
