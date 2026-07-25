import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("TheNull", () => {
	it("accepts null values", () => {
		const result = DS.TheNull.executeCheck(null);

		type _CheckFundamentalType = ExpectType<
			typeof DS.TheNull,
			DS.TheNull,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DS.FundamentalTypeValue<typeof DS.TheNull>,
			null,
			"strict"
		>;

		expect(result).toBe(DS.SuccessSymbol);
		expect(typeof DS.TheNull.symbol).toBe("symbol");
	});

	it("rejects non-null values without an error handler", () => {
		expect(DS.TheNull.executeCheck(undefined)).toBe(DS.ErrorSymbol);
	});

	it("adds itself to the error handler when a non-null value is rejected", () => {
		const errorHandler = DS.createGetErrorHandler();

		expect(DS.TheNull.executeCheck("null", errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheNull);
	});
});
