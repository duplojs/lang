import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("TheBigint", () => {
	it("accepts bigint values", () => {
		const result = DS.TheBigint.executeCheck(12n);

		type _CheckFundamentalType = ExpectType<
			typeof DS.TheBigint,
			DS.TheBigint,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DS.FundamentalTypeValue<typeof DS.TheBigint>,
			bigint,
			"strict"
		>;

		expect(result).toBe(DS.SuccessSymbol);
		expect(typeof DS.TheBigint.symbol).toBe("symbol");
	});

	it("rejects non-bigint values without an error handler", () => {
		expect(DS.TheBigint.executeCheck(12)).toBe(DS.ErrorSymbol);
	});

	it("adds itself to the error handler when a non-bigint value is rejected", () => {
		const errorHandler = DS.createGetErrorHandler();

		expect(DS.TheBigint.executeCheck("12", errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheBigint);
	});
});
