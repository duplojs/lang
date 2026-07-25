import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("TheUndefined", () => {
	it("accepts undefined values", () => {
		const result = DS.TheUndefined.executeCheck(undefined);

		type _CheckFundamentalType = ExpectType<
			typeof DS.TheUndefined,
			DS.TheUndefined,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DS.FundamentalTypeValue<typeof DS.TheUndefined>,
			undefined,
			"strict"
		>;

		expect(result).toBe(DS.SuccessSymbol);
		expect(typeof DS.TheUndefined.symbol).toBe("symbol");
	});

	it("rejects non-undefined values without an error handler", () => {
		expect(DS.TheUndefined.executeCheck(null)).toBe(DS.ErrorSymbol);
	});

	it("adds itself to the error handler when a non-undefined value is rejected", () => {
		const errorHandler = DS.createGetErrorHandler();

		expect(DS.TheUndefined.executeCheck("undefined", errorHandler)).toBe(
			DS.ErrorSymbol,
		);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(
			DS.TheUndefined,
		);
	});
});
