import { DDataStructure, type DString, type ExpectType } from "@scripts";

describe("NotEmptyConstraint", () => {
	it("creates a synchronous non-empty string constraint", () => {
		const constraint = DDataStructure.NotEmptyConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.NotEmptyConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DString.NotEmpty,
			"strict"
		>;

		expect(constraint.definition).toEqual({});
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts non-empty strings", () => {
		const constraint = DDataStructure.NotEmptyConstraint();

		expect(constraint.executeCheck("value")).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects empty strings without an error handler", () => {
		const constraint = DDataStructure.NotEmptyConstraint();

		expect(constraint.executeCheck("")).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when an empty string is rejected", () => {
		const constraint = DDataStructure.NotEmptyConstraint();
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(constraint.executeCheck("", errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(constraint);
	});
});
