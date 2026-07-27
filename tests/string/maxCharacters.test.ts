import { DString, pipe, type ExpectType } from "@scripts";

describe("maxCharacters", () => {
	it("should validate a string shorter than the maximum", () => {
		expect(DString.maxCharacters("hello", 5)).toBe(true);
		expect(DString.maxCharacters("hello!", 5)).toBe(false);
	});

	it("should validate a string in pipe", () => {
		const result = pipe(
			"hello",
			DString.maxCharacters(5),
		);

		expect(result).toBe(true);
	});

	it("should narrow the string with a max characters constraint", () => {
		const source = "hello" as string;

		if (DString.maxCharacters(source, 5)) {
			type _CheckSource = ExpectType<
				typeof source,
				string & DString.MaxCharacters<5>,
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				string,
				"strict"
			>;
		}
	});
});
