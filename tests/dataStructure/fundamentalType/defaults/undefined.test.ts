import { DDataStructure, type ExpectType } from "@scripts";

describe("TheUndefined", () => {
	it("accepts undefined values", () => {
		const result = DDataStructure.TheUndefined.executeCheck(undefined);

		type _CheckFundamentalType = ExpectType<
			typeof DDataStructure.TheUndefined,
			DDataStructure.TheUndefined,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DDataStructure.FundamentalTypeValue<typeof DDataStructure.TheUndefined>,
			undefined,
			"strict"
		>;

		expect(result).toBe(DDataStructure.SuccessSymbol);
		expect(typeof DDataStructure.TheUndefined.symbol).toBe("symbol");
	});

	it("rejects non-undefined values without an error handler", () => {
		expect(DDataStructure.TheUndefined.executeCheck(null)).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when a non-undefined value is rejected", () => {
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(DDataStructure.TheUndefined.executeCheck("undefined", errorHandler)).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(
			DDataStructure.TheUndefined,
		);
	});
});
