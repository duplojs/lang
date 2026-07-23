import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("EmailConstraint", () => {
	it("creates a synchronous email constraint", () => {
		const constraint = DS.EmailConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DS.EmailConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DS.ConstraintValue<typeof constraint>,
			`${string}@${string}.${string}`,
			"strict"
		>;

		expect(constraint.definition).toEqual({ regex: DS.emailRegex });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts valid email values", () => {
		const constraint = DS.EmailConstraint();

		expect(constraint.executeCheck("user.name+tag@example-domain.com")).toBe(
			DS.SuccessSymbol,
		);
	});

	it("rejects invalid email values without an error handler", () => {
		const constraint = DS.EmailConstraint();

		expect(constraint.executeCheck(".user@example.com")).toBe(DS.ErrorSymbol);
		expect(constraint.executeCheck("user@example")).toBe(DS.ErrorSymbol);
	});

	it("adds itself to the error handler when an invalid email is rejected", () => {
		const constraint = DS.EmailConstraint();
		const errorHandler = DS.createGetErrorHandler();

		expect(constraint.executeCheck("user..name@example.com", errorHandler)).toBe(
			DS.ErrorSymbol,
		);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(constraint);
	});
});
