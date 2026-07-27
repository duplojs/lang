import { DString, type ExpectType } from "@scripts";

describe("toUpperCase", () => {
	it("should convert string to upper case", () => {
		const result = DString.toUpperCase("hello");

		expect(result).toBe("HELLO");

		type _CheckResult = ExpectType<
			typeof result,
			"HELLO",
			"strict"
		>;
	});
});
