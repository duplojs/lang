import { DDataStructure, type DNumber, type ExpectType } from "@scripts";

describe("GreaterThanConstraint", () => {
	it("creates a synchronous greater than constraint", () => {
		const constraint = DDataStructure.GreaterThanConstraint(3);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.GreaterThanConstraint<3>,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			number & DNumber.GreaterThan<3>,
			"strict"
		>;

		expect(constraint.definition).toEqual({ threshold: 3 });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts numbers greater than the threshold", () => {
		const constraint = DDataStructure.GreaterThanConstraint(3);

		expect(constraint.executeCheck(4)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects numbers less than or equal to the threshold without an error handler", () => {
		const constraint = DDataStructure.GreaterThanConstraint(3);

		expect(constraint.executeCheck(3)).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck(2)).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when a low number is rejected", () => {
		const constraint = DDataStructure.GreaterThanConstraint(3);
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(constraint.executeCheck(3, errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(constraint);
	});
});
