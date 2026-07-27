import { DDataStructure, type ExpectType } from "@scripts";

describe("TheBigint", () => {
	it("accepts bigint values", () => {
		const result = DDataStructure.TheBigint.executeCheck(12n);

		type _CheckFundamentalType = ExpectType<
			typeof DDataStructure.TheBigint,
			DDataStructure.TheBigint,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DDataStructure.FundamentalTypeValue<typeof DDataStructure.TheBigint>,
			bigint,
			"strict"
		>;

		expect(result).toBe(DDataStructure.SuccessSymbol);
		expect(typeof DDataStructure.TheBigint.symbol).toBe("symbol");
	});

	it("rejects non-bigint values without an error handler", () => {
		expect(DDataStructure.TheBigint.executeCheck(12)).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when a non-bigint value is rejected", () => {
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(DDataStructure.TheBigint.executeCheck("12", errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DDataStructure.TheBigint);
	});
});
