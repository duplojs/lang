import { DString, type ExpectType } from "@scripts";

describe("shift", () => {
	it("should remove the first character", () => {
		const result = DString.shift("hello");

		expect(result).toBe("ello");

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("should keep an empty string unchanged", () => {
		expect(DString.shift("")).toBe("");
	});
});
