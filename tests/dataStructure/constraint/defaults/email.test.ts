import { DDataStructure, type DString, type ExpectType } from "@scripts";

describe("EmailConstraint", () => {
	it("creates a synchronous email constraint", () => {
		const constraint = DDataStructure.EmailConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.EmailConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DString.Email,
			"strict"
		>;

		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts valid email values", () => {
		const constraint = DDataStructure.EmailConstraint();

		expect(constraint.executeCheck("user.name+tag@example-domain.com")).toBe(
			DDataStructure.SuccessSymbol,
		);
	});

	it("rejects invalid email values without an error handler", () => {
		const constraint = DDataStructure.EmailConstraint();

		expect(constraint.executeCheck(".user@example.com")).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck("user@example")).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when an invalid email is rejected", () => {
		const constraint = DDataStructure.EmailConstraint();
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(constraint.executeCheck("user..name@example.com", errorHandler)).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(constraint);
	});
});
