import { DArray, pipe, type ExpectType } from "@scripts";

describe("unshift", () => {
	it("should unshift values without mutating the source", () => {
		const source = [1, 2] as number[] & DArray.MinElements<2>;
		const result = DArray.unshift(source, "a", true);

		expect(result).toEqual(["a", true, 1, 2]);
		expect(source).toEqual([1, 2]);

		type _CheckResult = ExpectType<
			typeof result,
			(number | string | boolean)[] & DArray.MinElements<2>,
			"strict"
		>;
	});

	it("should unshift a value in pipe", () => {
		const result = pipe(
			[1, 2] as const,
			DArray.unshift("a"),
		);

		expect(result).toEqual(["a", 1, 2]);
	});

	it("should discard incompatible size constraints", () => {
		const sourceMax = [1, 2] as number[] & DArray.MaxElements<2>;
		const resultMax = DArray.unshift(sourceMax, "a");

		type _CheckMaxResult = ExpectType<
			typeof resultMax,
			(number | string)[],
			"strict"
		>;

		const sourceLength = [1, 2] as number[] & DArray.LengthEqual<2>;
		const resultLength = DArray.unshift(sourceLength, "a");

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			(number | string)[],
			"strict"
		>;
	});
});
