import { describe, expect, it } from "vitest";
import { DChrono, DS, type ExpectType } from "@scripts";

describe("TheDate", () => {
	it("accepts chrono date values", () => {
		const value = DChrono.TheDate.new(0);
		const result = DS.TheDate.executeCheck(value);

		type _CheckFundamentalType = ExpectType<
			typeof DS.TheDate,
			DS.TheDate,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DS.FundamentalTypeValue<typeof DS.TheDate>,
			DChrono.TheDate,
			"strict"
		>;

		expect(result).toBe(DS.SuccessSymbol);
		expect(typeof DS.TheDate.symbol).toBe("symbol");
	});

	it("rejects non-chrono date values without an error handler", () => {
		expect(DS.TheDate.executeCheck(new Date(0))).toBe(DS.ErrorSymbol);
	});

	it("adds itself to the error handler when a non-chrono date value is rejected", () => {
		const errorHandler = DS.createGetErrorHandler();
		const value = new Date(0);

		expect(DS.TheDate.executeCheck(value, errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheDate);
	});
});
