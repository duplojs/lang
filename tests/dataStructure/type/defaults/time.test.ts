import { describe, expect, it } from "vitest";
import { DChrono, DS, type ExpectType } from "@scripts";

describe("TimeType", () => {
	it("creates a synchronous time type", () => {
		const type = DS.TimeType();

		type _CheckType = ExpectType<
			typeof type,
			DS.TimeType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DS.TypeValue<typeof type>,
			DChrono.TheTime,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DS.TheTime);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts chrono time values", () => {
		const type = DS.TimeType();

		expect(type.executeCheck(DChrono.TheTime.new(0))).toBe(DS.SuccessSymbol);
	});

	it("rejects non-chrono time values through its fundamental type", () => {
		const type = DS.TimeType();
		const errorHandler = DS.createGetErrorHandler();

		expect(type.executeCheck(0, errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheTime);
	});
});
