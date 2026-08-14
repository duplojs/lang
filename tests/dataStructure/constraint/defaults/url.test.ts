import { DDataStructure, type DString, type ExpectType } from "@scripts";

describe("UrlConstraint", () => {
	it("creates a synchronous url constraint", () => {
		const params = { protocol: /^https$/ };
		const constraint = DDataStructure.UrlConstraint(params);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.UrlConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			string & DString.Url,
			"strict"
		>;

		expect(constraint.definition).toEqual({ params });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts valid url values", () => {
		const constraint = DDataStructure.UrlConstraint();

		expect(constraint.executeCheck("https://example.com")).toBe(
			DDataStructure.SuccessSymbol,
		);
	});

	it("rejects invalid url values without an error handler", () => {
		const constraint = DDataStructure.UrlConstraint({ protocol: /^https$/ });

		expect(constraint.executeCheck("not-a-url")).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.executeCheck("ftp://example.com")).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when an invalid url is rejected", () => {
		const constraint = DDataStructure.UrlConstraint();
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(constraint.executeCheck("not-a-url", errorHandler)).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(constraint);
	});
});
