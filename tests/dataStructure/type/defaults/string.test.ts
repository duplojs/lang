import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("StringType", () => {
	it("creates a synchronous string type", () => {
		const type = DS.StringType();

		type _CheckType = ExpectType<
			typeof type,
			DS.StringType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DS.TypeValue<typeof type>,
			string,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DS.TheString);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts string values", () => {
		const type = DS.StringType();

		expect(type.executeCheck("value")).toBe(DS.SuccessSymbol);
	});

	it("rejects non-string values through its fundamental type", () => {
		const type = DS.StringType();
		const errorHandler = DS.createGetErrorHandler();

		expect(type.executeCheck(12, errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheString);
	});
});
