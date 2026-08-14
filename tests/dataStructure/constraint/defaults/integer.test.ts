import { DDataStructure, type DNumber, type ExpectType } from "@scripts";

describe("IntegerConstraint", () => {
	it("creates a synchronous integer constraint", () => {
		const constraint = DDataStructure.IntegerConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.IntegerConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			number & DNumber.Integer,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts integer numbers", () => {
		const constraint = DDataStructure.IntegerConstraint();

		expect(constraint.executeCheck(2)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects decimal numbers without an error handler", () => {
		const constraint = DDataStructure.IntegerConstraint();

		expect(constraint.executeCheck(2.5)).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when a decimal number is rejected", () => {
		const constraint = DDataStructure.IntegerConstraint();
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(constraint.executeCheck(2.5, errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(constraint);
	});
});
