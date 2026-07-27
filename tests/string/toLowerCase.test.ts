import { DString, type ExpectType } from "@scripts";

describe("toLowerCase", () => {
	it("should convert string to lower case", () => {
		const result = DString.toLowerCase("HELLO");

		expect(result).toBe("hello");

		type _CheckResult = ExpectType<
			typeof result,
			"hello",
			"strict"
		>;
	});
});
