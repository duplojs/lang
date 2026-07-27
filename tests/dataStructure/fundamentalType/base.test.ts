import { DDataStructure, type ExpectType } from "@scripts";

describe("createFundamentalType", () => {
	it("creates a discriminable fundamental type that delegates checks with itself", () => {
		const symbol = Symbol("test-fundamental-type");
		const executeCheck = vi.fn(
			(
				self: TestFundamentalType,
				data: unknown,
				errorHandler?: DDataStructure.GetErrorHandler,
			) => data === "valid"
				? DDataStructure.SuccessSymbol
				: errorHandler?.().addIssue(self, data) ?? DDataStructure.ErrorSymbol,
		);

		interface TestFundamentalType extends DDataStructure.FundamentalType<
			typeof symbol,
			string
		> {}

		const fundamentalType = DDataStructure.createFundamentalType<TestFundamentalType>(
			symbol,
			executeCheck,
		);

		type _CheckFundamentalType = ExpectType<
			typeof fundamentalType,
			TestFundamentalType,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DDataStructure.FundamentalTypeValue<typeof fundamentalType>,
			string,
			"strict"
		>;

		expect(fundamentalType.symbol).toBe(symbol);
		expect(fundamentalType.executeCheck("valid")).toBe(DDataStructure.SuccessSymbol);
		expect(fundamentalType.executeCheck("invalid")).toBe(DDataStructure.ErrorSymbol);
		expect(executeCheck).toHaveBeenNthCalledWith(
			1,
			fundamentalType,
			"valid",
			undefined,
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			2,
			fundamentalType,
			"invalid",
			undefined,
		);
	});

	it("forwards the error handler and preserves asynchronous checks", async() => {
		const symbol = Symbol("test-async-fundamental-type");
		const errorHandler = DDataStructure.createGetErrorHandler();
		const executeCheck = vi.fn(
			(
				self: TestFundamentalType,
				data: unknown,
				errorHandler?: DDataStructure.GetErrorHandler,
			) => Promise.resolve(
				data === "valid"
					? DDataStructure.SuccessSymbol
					: errorHandler?.().addIssue(self, data) ?? DDataStructure.ErrorSymbol,
			),
		);

		interface TestFundamentalType extends DDataStructure.FundamentalType<
			typeof symbol,
			string
		> {}

		const fundamentalType = DDataStructure.createFundamentalType<TestFundamentalType>(
			symbol,
			executeCheck,
		);

		await expect(
			fundamentalType.executeCheck("invalid", errorHandler),
		).resolves.toBe(DDataStructure.ErrorSymbol);
		expect(executeCheck).toHaveBeenCalledWith(
			fundamentalType,
			"invalid",
			errorHandler,
		);
		expect(errorHandler().createError().issues).toHaveLength(1);
	});
});
