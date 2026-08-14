import { DDataStructure, type DNumber, type ExpectType } from "@scripts";

describe("OddConstraint", () => {
	it("creates a synchronous odd number constraint", () => {
		const constraint = DDataStructure.OddConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.OddConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DNumber.Odd,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts odd numbers", () => {
		const constraint = DDataStructure.OddConstraint();

		expect(constraint.executeCheck(3)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects even numbers without an error handler", () => {
		const constraint = DDataStructure.OddConstraint();

		expect(constraint.executeCheck(2)).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when an even number is rejected", () => {
		const constraint = DDataStructure.OddConstraint();
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(constraint.executeCheck(2, errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(constraint);
	});
});
