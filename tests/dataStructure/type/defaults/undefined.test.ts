import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("UndefinedType", () => {
	it("creates a synchronous undefined type", () => {
		const type = DS.UndefinedType();

		type _CheckType = ExpectType<
			typeof type,
			DS.UndefinedType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DS.TypeValue<typeof type>,
			undefined,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DS.TheUndefined);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts undefined values", () => {
		const type = DS.UndefinedType();

		expect(type.executeCheck(undefined)).toBe(DS.SuccessSymbol);
	});

	it("rejects non-undefined values through its fundamental type", () => {
		const type = DS.UndefinedType();
		const errorHandler = DS.createGetErrorHandler();

		expect(type.executeCheck(null, errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheUndefined);
	});
});
