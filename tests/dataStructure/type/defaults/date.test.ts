import { describe, expect, it } from "vitest";
import { DChrono, DS, type ExpectType } from "@scripts";

describe("DateType", () => {
	it("creates a synchronous date type", () => {
		const type = DS.DateType();

		type _CheckType = ExpectType<
			typeof type,
			DS.DateType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DS.TypeValue<typeof type>,
			DChrono.TheDate,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DS.TheDate);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts chrono date values", () => {
		const type = DS.DateType();

		expect(type.executeCheck(DChrono.TheDate.new(0))).toBe(DS.SuccessSymbol);
	});

	it("rejects non-chrono date values through its fundamental type", () => {
		const type = DS.DateType();
		const errorHandler = DS.createGetErrorHandler();

		expect(type.executeCheck(new Date(0), errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheDate);
	});
});
