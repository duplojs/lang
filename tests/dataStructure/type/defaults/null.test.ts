import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("NullType", () => {
	it("creates a synchronous null type", () => {
		const type = DS.NullType();

		type _CheckType = ExpectType<
			typeof type,
			DS.NullType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DS.TypeValue<typeof type>,
			null,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DS.TheNull);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts null values", () => {
		const type = DS.NullType();

		expect(type.executeCheck(null)).toBe(DS.SuccessSymbol);
	});

	it("rejects non-null values through its fundamental type", () => {
		const type = DS.NullType();
		const errorHandler = DS.createGetErrorHandler();

		expect(type.executeCheck(undefined, errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheNull);
	});
});
