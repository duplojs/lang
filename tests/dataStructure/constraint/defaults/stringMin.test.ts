import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("StringMinConstraint", () => {
	it("creates a synchronous string minimum constraint", () => {
		const constraint = DS.StringMinConstraint(3);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DS.StringMinConstraint<3>,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DS.ConstraintValue<typeof constraint>,
			string,
			"strict"
		>;

		expect(constraint.definition).toEqual({ min: 3 });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts strings with at least the minimum length", () => {
		const constraint = DS.StringMinConstraint(3);

		expect(constraint.executeCheck("abc")).toBe(DS.SuccessSymbol);
		expect(constraint.executeCheck("abcd")).toBe(DS.SuccessSymbol);
	});

	it("rejects shorter strings without an error handler", () => {
		const constraint = DS.StringMinConstraint(3);

		expect(constraint.executeCheck("ab")).toBe(DS.ErrorSymbol);
	});

	it("adds itself to the error handler when a shorter string is rejected", () => {
		const constraint = DS.StringMinConstraint(3);
		const errorHandler = DS.createGetErrorHandler();

		expect(constraint.executeCheck("", errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(constraint);
	});
});
