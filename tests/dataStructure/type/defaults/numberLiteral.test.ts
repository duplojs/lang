import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("NumberLiteralType", () => {
	it("creates a synchronous number literal type", () => {
		const type = DS.NumberLiteralType(12);

		type _CheckType = ExpectType<
			typeof type,
			DS.NumberLiteralType<12>,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DS.TypeValue<typeof type>,
			12,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DS.TheNumber);
		expect(type.definition).toEqual({ value: 12 });
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts its literal value", () => {
		const type = DS.NumberLiteralType(12);

		expect(type.executeCheck(12)).toBe(DS.SuccessSymbol);
	});

	it("rejects non-number values through its fundamental type", () => {
		const type = DS.NumberLiteralType(12);
		const errorHandler = DS.createGetErrorHandler();

		expect(type.executeCheck("12", errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheNumber);
	});

	it("rejects another number value through its literal type", () => {
		const type = DS.NumberLiteralType(12);
		const errorHandler = DS.createGetErrorHandler();

		expect(type.executeCheck(24, errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(type);
	});
});
