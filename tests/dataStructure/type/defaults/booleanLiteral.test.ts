import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("BooleanLiteralType", () => {
	it("creates a synchronous boolean literal type", () => {
		const type = DS.BooleanLiteralType(true);

		type _CheckType = ExpectType<
			typeof type,
			DS.BooleanLiteralType<true>,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DS.TypeValue<typeof type>,
			true,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DS.TheBoolean);
		expect(type.definition).toEqual({ value: true });
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts its literal value", () => {
		const type = DS.BooleanLiteralType(true);

		expect(type.executeCheck(true)).toBe(DS.SuccessSymbol);
	});

	it("rejects non-boolean values through its fundamental type", () => {
		const type = DS.BooleanLiteralType(true);
		const errorHandler = DS.createGetErrorHandler();

		expect(type.executeCheck("true", errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheBoolean);
	});

	it("rejects another boolean value through its literal type", () => {
		const type = DS.BooleanLiteralType(true);
		const errorHandler = DS.createGetErrorHandler();

		expect(type.executeCheck(false, errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(type);
	});
});
