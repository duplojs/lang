import { DDataStructure, type DNumber, type ExpectType } from "@scripts";

describe("SafeConstraint", () => {
	it("creates a synchronous safe number constraint", () => {
		const constraint = DDataStructure.SafeConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.SafeConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			number & DNumber.Safe,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts safe numbers", () => {
		const constraint = DDataStructure.SafeConstraint();

		expect(constraint.executeCheck(0)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects unsafe numbers without an error handler", () => {
		const constraint = DDataStructure.SafeConstraint();

		expect(constraint.executeCheck(Number.MAX_SAFE_INTEGER)).toBe(
			DDataStructure.ErrorSymbol,
		);
	});

	it("adds itself to the error handler when an unsafe number is rejected", () => {
		const constraint = DDataStructure.SafeConstraint();
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(constraint.executeCheck(Number.MAX_SAFE_INTEGER, errorHandler)).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(constraint);
	});
});
