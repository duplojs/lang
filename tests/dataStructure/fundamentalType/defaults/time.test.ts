import { describe, expect, it } from "vitest";
import { DChrono, DS, type ExpectType } from "@scripts";

describe("TheTime", () => {
	it("accepts chrono time values", () => {
		const value = DChrono.TheTime.new(0);
		const result = DS.TheTime.executeCheck(value);

		type _CheckFundamentalType = ExpectType<
			typeof DS.TheTime,
			DS.TheTime,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DS.FundamentalTypeValue<typeof DS.TheTime>,
			DChrono.TheTime,
			"strict"
		>;

		expect(result).toBe(DS.SuccessSymbol);
		expect(typeof DS.TheTime.symbol).toBe("symbol");
	});

	it("rejects non-chrono time values without an error handler", () => {
		expect(DS.TheTime.executeCheck(0)).toBe(DS.ErrorSymbol);
	});

	it("adds itself to the error handler when a non-chrono time value is rejected", () => {
		const errorHandler = DS.createGetErrorHandler();

		expect(DS.TheTime.executeCheck("0", errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheTime);
	});
});
