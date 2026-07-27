import { DChrono, DDataStructure, type ExpectType } from "@scripts";

describe("TheTime", () => {
	it("accepts chrono time values", () => {
		const value = DChrono.TheTime.new(0);
		const result = DDataStructure.TheTime.executeCheck(value);

		type _CheckFundamentalType = ExpectType<
			typeof DDataStructure.TheTime,
			DDataStructure.TheTime,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DDataStructure.FundamentalTypeValue<typeof DDataStructure.TheTime>,
			DChrono.TheTime,
			"strict"
		>;

		expect(result).toBe(DDataStructure.SuccessSymbol);
		expect(typeof DDataStructure.TheTime.symbol).toBe("symbol");
	});

	it("rejects non-chrono time values without an error handler", () => {
		expect(DDataStructure.TheTime.executeCheck(0)).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when a non-chrono time value is rejected", () => {
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(DDataStructure.TheTime.executeCheck("0", errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DDataStructure.TheTime);
	});
});
