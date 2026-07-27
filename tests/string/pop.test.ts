import { DString, type ExpectType } from "@scripts";

describe("pop", () => {
	it("should remove the last character", () => {
		const result = DString.pop("hello");

		expect(result).toBe("hell");

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("should keep an empty string unchanged", () => {
		expect(DString.pop("")).toBe("");
	});
});
