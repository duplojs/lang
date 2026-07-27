import { DString, pipe, type ExpectType } from "@scripts";

describe("concat", () => {
	it("should append strings", () => {
		const result = DString.concat("hello", " ", "world");

		expect(result).toBe("hello world");

		type _CheckResult = ExpectType<
			typeof result,
			"hello world",
			"strict"
		>;
	});

	it("should append a string in pipe", () => {
		const result = pipe(
			"hello",
			DString.concat(" world"),
		);

		expect(result).toBe("hello world");

		type _CheckResult = ExpectType<
			typeof result,
			"hello world",
			"strict"
		>;
	});
});
