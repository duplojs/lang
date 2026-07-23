import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("NumberType", () => {
	it("creates a synchronous number type", () => {
		const type = DS.NumberType();

		type _CheckType = ExpectType<
			typeof type,
			DS.NumberType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DS.TypeValue<typeof type>,
			number,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DS.TheNumber);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts number values", () => {
		const type = DS.NumberType();

		expect(type.executeCheck(12)).toBe(DS.SuccessSymbol);
	});

	it("rejects non-number values through its fundamental type", () => {
		const type = DS.NumberType();
		const errorHandler = DS.createGetErrorHandler();

		expect(type.executeCheck("12", errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheNumber);
	});
});
