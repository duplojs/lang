import { describe, expect, it, vi } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("createFundamentalType", () => {
	it("creates a discriminable fundamental type that delegates checks with itself", () => {
		const symbol = Symbol("test-fundamental-type");
		const executeCheck = vi.fn(
			(
				self: TestFundamentalType,
				data: unknown,
				errorHandler?: DS.GetErrorHandler,
			) => data === "valid"
				? DS.SuccessSymbol
				: errorHandler?.().addIssue(self) ?? DS.ErrorSymbol,
		);

		interface TestFundamentalType extends DS.FundamentalType<
			typeof symbol,
			string
		> {}

		const fundamentalType = DS.createFundamentalType<TestFundamentalType>(
			symbol,
			executeCheck,
		);

		type _CheckFundamentalType = ExpectType<
			typeof fundamentalType,
			TestFundamentalType,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DS.FundamentalTypeValue<typeof fundamentalType>,
			string,
			"strict"
		>;

		expect(fundamentalType.symbol).toBe(symbol);
		expect(fundamentalType.executeCheck("valid")).toBe(DS.SuccessSymbol);
		expect(fundamentalType.executeCheck("invalid")).toBe(DS.ErrorSymbol);
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
});
