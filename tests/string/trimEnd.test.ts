import { DString, type ExpectType } from "@scripts";

describe("trimEnd", () => {
	it("should trim the end of a string", () => {
		const result = DString.trimEnd("  hello  ");

		expect(result).toBe("  hello");

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});
});
