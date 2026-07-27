import { DString, pipe, type ExpectType } from "@scripts";

describe("prepend", () => {
	it("should prepend strings", () => {
		const result = DString.prepend("world", "hello", " ");

		expect(result).toBe("hello world");

		type _CheckResult = ExpectType<
			typeof result,
			"hello world",
			"strict"
		>;
	});

	it("should prepend a string in pipe", () => {
		const result = pipe(
			"world",
			DString.prepend("hello "),
		);

		expect(result).toBe("hello world");

		type _CheckResult = ExpectType<
			typeof result,
			"hello world",
			"strict"
		>;
	});
});
