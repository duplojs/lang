import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("TheString", () => {
	it("accepts string values", () => {
		const result = DS.TheString.executeCheck("value");

		type _CheckFundamentalType = ExpectType<
			typeof DS.TheString,
			DS.TheString,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DS.FundamentalTypeValue<typeof DS.TheString>,
			string,
			"strict"
		>;

		expect(result).toBe(DS.SuccessSymbol);
		expect(typeof DS.TheString.symbol).toBe("symbol");
	});

	it("rejects non-string values without an error handler", () => {
		expect(DS.TheString.executeCheck(12)).toBe(DS.ErrorSymbol);
	});

	it("adds itself to the error handler when a non-string value is rejected", () => {
		const errorHandler = DS.createGetErrorHandler();

		expect(DS.TheString.executeCheck(12n, errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheString);
	});
});
