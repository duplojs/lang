import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("StringLiteralType", () => {
	it("creates a synchronous string literal type", () => {
		const type = DS.StringLiteralType("value");

		type _CheckType = ExpectType<
			typeof type,
			DS.StringLiteralType<"value">,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DS.TypeValue<typeof type>,
			"value",
			"strict"
		>;

		expect(type.fundamentalType).toBe(DS.TheString);
		expect(type.definition).toEqual({ value: "value" });
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts its literal value", () => {
		const type = DS.StringLiteralType("value");

		expect(type.executeCheck("value")).toBe(DS.SuccessSymbol);
	});

	it("rejects non-string values through its fundamental type", () => {
		const type = DS.StringLiteralType("value");
		const errorHandler = DS.createGetErrorHandler();

		expect(type.executeCheck(12, errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheString);
	});

	it("rejects another string value through its literal type", () => {
		const type = DS.StringLiteralType("value");
		const errorHandler = DS.createGetErrorHandler();

		expect(type.executeCheck("other", errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(type);
	});
});
