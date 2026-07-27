import { DString, type ExpectType } from "@scripts";

describe("uncapitalize", () => {
	it("should uncapitalize the first character", () => {
		const result = DString.uncapitalize("Hello World");

		expect(result).toBe("hello World");

		type _CheckResult = ExpectType<
			typeof result,
			"hello World",
			"strict"
		>;
	});

	it("should keep an empty string unchanged", () => {
		expect(DString.uncapitalize("")).toBe("");
	});
});
