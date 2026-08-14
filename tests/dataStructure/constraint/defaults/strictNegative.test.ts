import { DDataStructure, type DNumber, type ExpectType } from "@scripts";

describe("StrictNegativeConstraint", () => {
	it("creates a synchronous strict negative number constraint", () => {
		const constraint = DDataStructure.StrictNegativeConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.StrictNegativeConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			number & DNumber.StrictNegative,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts strictly negative numbers", () => {
		const constraint = DDataStructure.StrictNegativeConstraint();

		expect(constraint.executeCheck(-1)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects zero and positive numbers without an error handler", () => {
		const constraint = DDataStructure.StrictNegativeConstraint();

		expect(constraint.executeCheck(0)).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck(1)).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when zero is rejected", () => {
		const constraint = DDataStructure.StrictNegativeConstraint();
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(constraint.executeCheck(0, errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(constraint);
	});
});
