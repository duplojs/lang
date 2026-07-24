import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("result symbols", () => {
	it("exposes stable success and error symbols", () => {
		type _CheckSuccessSymbol = ExpectType<
			typeof DS.SuccessSymbol,
			DS.SuccessSymbol,
			"strict"
		>;
		type _CheckErrorSymbol = ExpectType<
			typeof DS.ErrorSymbol,
			DS.ErrorSymbol,
			"strict"
		>;

		expect(typeof DS.SuccessSymbol).toBe("symbol");
		expect(typeof DS.ErrorSymbol).toBe("symbol");
		expect(DS.SuccessSymbol).not.toBe(DS.ErrorSymbol);
		expect(String(DS.SuccessSymbol)).toBe("Symbol(SuccessSymbol)");
		expect(String(DS.ErrorSymbol)).toBe("Symbol(ErrorSymbol)");
	});
});
