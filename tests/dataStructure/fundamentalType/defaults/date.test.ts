import { DChrono, DDataStructure, type ExpectType } from "@scripts";

describe("TheDate", () => {
	it("accepts chrono date values", () => {
		const value = DChrono.TheDate.new(0);
		const result = DDataStructure.TheDate.executeCheck(value);

		type _CheckFundamentalType = ExpectType<
			typeof DDataStructure.TheDate,
			DDataStructure.TheDate,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DDataStructure.FundamentalTypeValue<typeof DDataStructure.TheDate>,
			DChrono.TheDate,
			"strict"
		>;

		expect(result).toBe(DDataStructure.SuccessSymbol);
		expect(typeof DDataStructure.TheDate.symbol).toBe("symbol");
	});

	it("rejects non-chrono date values without an error handler", () => {
		expect(DDataStructure.TheDate.executeCheck(new Date(0))).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when a non-chrono date value is rejected", () => {
		const errorHandler = DDataStructure.createGetErrorHandler();
		const value = new Date(0);

		expect(DDataStructure.TheDate.executeCheck(value, errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DDataStructure.TheDate);
	});
});
