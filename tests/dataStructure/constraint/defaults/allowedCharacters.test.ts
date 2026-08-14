import { DDataStructure, type DString, type ExpectType } from "@scripts";

describe("AllowedCharactersConstraint", () => {
	it("creates a synchronous allowed characters constraint", () => {
		const constraint = DDataStructure.AllowedCharactersConstraint("a-z");

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.AllowedCharactersConstraint<"a-z">,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			string & DString.AllowedCharacters<"a-z">,
			"strict"
		>;

		expect(constraint.definition).toEqual({ charactersRange: "a-z" });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts strings composed of allowed characters", () => {
		const constraint = DDataStructure.AllowedCharactersConstraint(["a-z", "0-9"]);

		expect(constraint.executeCheck("abc123")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("")).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects strings containing forbidden characters without an error handler", () => {
		const constraint = DDataStructure.AllowedCharactersConstraint("a-z");

		expect(constraint.executeCheck("ABC")).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when forbidden characters are rejected", () => {
		const constraint = DDataStructure.AllowedCharactersConstraint("a-z");
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(constraint.executeCheck("ABC", errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(constraint);
	});
});
