import { DString, pipe, type ExpectType } from "@scripts";

describe("lengthEqual", () => {
	it("should validate a string with the expected length", () => {
		expect(DString.lengthEqual("code", 4)).toBe(true);
		expect(DString.lengthEqual("code", 5)).toBe(false);
	});

	it("should validate a string in pipe", () => {
		const result = pipe(
			"code",
			DString.lengthEqual(4),
		);

		expect(result).toBe(true);
	});

	it("should narrow the string with a length equal constraint", () => {
		const source = "code" as string;

		if (DString.lengthEqual(source, 4)) {
			type _CheckSource = ExpectType<
				typeof source,
				string & DString.LengthEqual<4>,
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
