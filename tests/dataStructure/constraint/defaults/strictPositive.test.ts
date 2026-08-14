import { DDataStructure, type DNumber, type ExpectType } from "@scripts";

describe("StrictPositiveConstraint", () => {
	it("creates a synchronous strict positive number constraint", () => {
		const constraint = DDataStructure.StrictPositiveConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.StrictPositiveConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.StrictPositive,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts strictly positive numbers", () => {
		const constraint = DDataStructure.StrictPositiveConstraint();

		expect(constraint.executeCheck(1)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects zero and negative numbers without an error handler", () => {
		const constraint = DDataStructure.StrictPositiveConstraint();

		expect(constraint.executeCheck(0)).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck(-1)).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when zero is rejected", () => {
		const constraint = DDataStructure.StrictPositiveConstraint();
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(constraint.executeCheck(0, errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(constraint);
	});
});
