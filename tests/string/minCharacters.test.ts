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

	it("should discriminate compatible size constraints", () => {
		const source = "hello" as
			| (string & DString.MinCharacters<2>)
			| (string & DString.MinCharacters<5>)
			| (string & DString.LengthEqual<4>)
			| (string & DString.MaxCharacters<2>)
			| (string & DString.MaxCharacters<5>);

		if (DString.minCharacters(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				| (string & DString.MinCharacters<5>)
				| (string & DString.MinCharacters<2> & DString.MinCharacters<3>)
				| (string & DString.LengthEqual<4>)
				| (string & DString.MaxCharacters<5> & DString.MinCharacters<3>),
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				| (string & DString.MinCharacters<2>)
				| (string & DString.MaxCharacters<2>)
				| (string & DString.MaxCharacters<5>),
				"strict"
			>;
		}
	});

	it("should reject incompatible min characters constraints", () => {
		const sourceMax = "hi" as string & DString.MaxCharacters<2>;
		const sourceLength = "hi" as string & DString.LengthEqual<2>;
		const min = 3 as number;

		if (false) {
			// @ts-expect-error min must be a literal number.
			DString.minCharacters("hello", min);
		}

		// @ts-expect-error Cannot apply MinCharacters<3> on MaxCharacters<2>.
		expect(DString.minCharacters(sourceMax, 3)).toBe(false);

		// @ts-expect-error Cannot apply MinCharacters<3> on LengthEqual<2>.
		expect(DString.minCharacters(sourceLength, 3)).toBe(false);
	});
});
