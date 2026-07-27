import { DString, type ExpectType } from "@scripts";

describe("trimStart", () => {
	it("should trim the start of a string", () => {
		const result = DString.trimStart("  hello  ");

		expect(result).toBe("hello  ");

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});
});
