import { DString, type ExpectType } from "@scripts";

describe("trim", () => {
	it("should trim both sides of a string", () => {
		const result = DString.trim("  hello  ");

		expect(result).toBe("hello");

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});
});
