import { DString, type ExpectType } from "@scripts";

describe("capitalize", () => {
	it("should capitalize the first character", () => {
		const result = DString.capitalize("hello world");

		expect(result).toBe("Hello world");

		type _CheckResult = ExpectType<
			typeof result,
			"Hello world",
			"strict"
		>;
	});

	it("should keep an empty string unchanged", () => {
		expect(DString.capitalize("")).toBe("");
	});
});
