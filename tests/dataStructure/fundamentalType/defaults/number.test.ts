import { describe, expect, it, vi } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("TheNumber", () => {
	it("accepts number values", () => {
		const result = DS.TheNumber.executeCheck(12);

		type _CheckFundamentalType = ExpectType<
			typeof DS.TheNumber,
			DS.TheNumber,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DS.FundamentalTypeValue<typeof DS.TheNumber>,
			number,
			"strict"
		>;

		expect(result).toBe(DS.SuccessSymbol);
		expect(typeof DS.TheNumber.symbol).toBe("symbol");
	});

	it("rejects non-number values without an error handler", () => {
		expect(DS.TheNumber.executeCheck("12")).toBe(DS.ErrorSymbol);
	});

	it("rejects infinite numbers", () => {
		expect(DS.TheNumber.executeCheck(Infinity)).toBe(DS.ErrorSymbol);
		expect(DS.TheNumber.executeCheck(-Infinity)).toBe(DS.ErrorSymbol);
	});

	it("rejects NaN values", () => {
		expect(DS.TheNumber.executeCheck(Number.NaN)).toBe(DS.ErrorSymbol);
	});

	it("rejects a NaN value when the finite check passes", () => {
		const isFiniteSpy = vi
			.spyOn(globalThis, "isFinite")
			.mockReturnValueOnce(true);

		expect(DS.TheNumber.executeCheck(Number.NaN)).toBe(DS.ErrorSymbol);
		expect(isFiniteSpy).toHaveBeenCalledWith(Number.NaN);
		isFiniteSpy.mockRestore();
	});

	it("adds itself to the error handler when a non-number value is rejected", () => {
		const errorHandler = DS.createGetErrorHandler();

		expect(DS.TheNumber.executeCheck(12n, errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheNumber);
	});
});
