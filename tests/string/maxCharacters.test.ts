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

	it("should discriminate compatible size constraints", () => {
		const source = "ab" as
			| (string & DString.MaxCharacters<2>)
			| (string & DString.MaxCharacters<5>)
			| (string & DString.LengthEqual<4>)
			| (string & DString.MinCharacters<2>)
			| (string & DString.MinCharacters<5>);

		if (DString.maxCharacters(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				| (string & DString.MaxCharacters<2>)
				| (string & DString.MaxCharacters<5> & DString.MaxCharacters<3>)
				| (string & DString.MinCharacters<2> & DString.MaxCharacters<3>),
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				| (string & DString.MaxCharacters<5>)
				| (string & DString.LengthEqual<4>)
				| (string & DString.MinCharacters<2>)
				| (string & DString.MinCharacters<5>),
				"strict"
			>;
		}
	});

	it("should reject incompatible max characters constraints", () => {
		const sourceMin = "hello" as string & DString.MinCharacters<5>;
		const sourceLength = "hello" as string & DString.LengthEqual<5>;
		const max = 3 as number;

		if (false) {
			// @ts-expect-error max must be a literal number.
			DString.maxCharacters("hello", max);
		}

		// @ts-expect-error Cannot apply MaxCharacters<3> on MinCharacters<5>.
		expect(DString.maxCharacters(sourceMin, 3)).toBe(false);

		// @ts-expect-error Cannot apply MaxCharacters<3> on LengthEqual<5>.
		expect(DString.maxCharacters(sourceLength, 3)).toBe(false);
	});
});
