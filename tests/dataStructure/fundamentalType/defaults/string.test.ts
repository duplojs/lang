import { DDataStructure, type ExpectType } from "@scripts";

describe("TheString", () => {
	it("accepts string values", () => {
		const result = DDataStructure.TheString.executeCheck("value");

		type _CheckFundamentalType = ExpectType<
			typeof DDataStructure.TheString,
			DDataStructure.TheString,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DDataStructure.FundamentalTypeValue<typeof DDataStructure.TheString>,
			string,
			"strict"
		>;

		expect(result).toBe(DDataStructure.SuccessSymbol);
		expect(typeof DDataStructure.TheString.symbol).toBe("symbol");
	});

	it("rejects non-string values without an error handler", () => {
		expect(DDataStructure.TheString.executeCheck(12)).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when a non-string value is rejected", () => {
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(DDataStructure.TheString.executeCheck(12n, errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DDataStructure.TheString);
	});
});
