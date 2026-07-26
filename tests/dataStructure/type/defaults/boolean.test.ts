import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("BooleanType", () => {
	it("creates a synchronous boolean type", () => {
		const type = DS.BooleanType();

		type _CheckType = ExpectType<
			typeof type,
			DS.BooleanType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DS.TypeValue<typeof type>,
			boolean,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DS.TheBoolean);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts boolean values", () => {
		const type = DS.BooleanType();

		expect(type.executeCheck(true)).toBe(DS.SuccessSymbol);
		expect(type.executeCheck(false)).toBe(DS.SuccessSymbol);
	});

	it("rejects non-boolean values through its fundamental type", () => {
		const type = DS.BooleanType();
		const errorHandler = DS.createGetErrorHandler();

		expect(type.executeCheck("true", errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheBoolean);
	});
});
