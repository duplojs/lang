import { DString, pipe, type ExpectType } from "@scripts";

describe("minCharacters", () => {
	it("should validate a string longer than the minimum", () => {
		expect(DString.minCharacters("hello", 3)).toBe(true);
		expect(DString.minCharacters("hi", 3)).toBe(false);
	});

	it("should validate a string in pipe", () => {
		const result = pipe(
			"hello",
			DString.minCharacters(3),
		);

		expect(result).toBe(true);
	});

	it("should narrow the string with a min characters constraint", () => {
		const source = "hello" as string;

		if (DString.minCharacters(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				string & DString.MinCharacters<3>,
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
