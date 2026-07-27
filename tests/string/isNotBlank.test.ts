import { DString, type ExpectType } from "@scripts";

describe("isNotBlank", () => {
	it("should validate a string containing visible characters", () => {
		expect(DString.isNotBlank("hello")).toBe(true);
		expect(DString.isNotBlank("  \n\t  ")).toBe(false);
	});

	it("should narrow the string with a not blank constraint", () => {
		const source = "hello" as string;

		if (DString.isNotBlank(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				string & DString.NotBlank,
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
