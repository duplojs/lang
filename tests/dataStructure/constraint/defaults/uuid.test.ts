import { DDataStructure, type DString, type ExpectType } from "@scripts";

describe("UuidConstraint", () => {
	it("creates a synchronous uuid constraint", () => {
		const constraint = DDataStructure.UuidConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.UuidConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DString.Uuid,
			"strict"
		>;

		expect(constraint.definition).toEqual({ regex: DDataStructure.uuidRegex });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts valid uuid values", () => {
		const constraint = DDataStructure.UuidConstraint();

		expect(constraint.executeCheck("123e4567-e89b-12d3-a456-426614174000")).toBe(
			DDataStructure.SuccessSymbol,
		);
	});

	it("rejects invalid uuid values without an error handler", () => {
		const constraint = DDataStructure.UuidConstraint();

		expect(constraint.executeCheck("not-a-uuid")).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when an invalid uuid is rejected", () => {
		const constraint = DDataStructure.UuidConstraint();
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(constraint.executeCheck("not-a-uuid", errorHandler)).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(constraint);
	});
});
