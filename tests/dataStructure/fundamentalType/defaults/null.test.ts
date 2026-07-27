import { DDataStructure, type ExpectType } from "@scripts";

describe("TheNull", () => {
	it("accepts null values", () => {
		const result = DDataStructure.TheNull.executeCheck(null);

		type _CheckFundamentalType = ExpectType<
			typeof DDataStructure.TheNull,
			DDataStructure.TheNull,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DDataStructure.FundamentalTypeValue<typeof DDataStructure.TheNull>,
			null,
			"strict"
		>;

		expect(result).toBe(DDataStructure.SuccessSymbol);
		expect(typeof DDataStructure.TheNull.symbol).toBe("symbol");
	});

	it("rejects non-null values without an error handler", () => {
		expect(DDataStructure.TheNull.executeCheck(undefined)).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when a non-null value is rejected", () => {
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(DDataStructure.TheNull.executeCheck("null", errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DDataStructure.TheNull);
	});
});
