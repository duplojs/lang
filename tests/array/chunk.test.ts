import { DArray, pipe, type ExpectType } from "@scripts";

describe("chunk", () => {
	it("should split an array into chunks", () => {
		const result = DArray.chunk([1, 2, 3, 4, 5] as const, 2);

		expect(result).toEqual([[1, 2], [3, 4], [5]]);

		type _CheckResult = ExpectType<
			typeof result,
			(1 | 2 | 3 | 4 | 5)[][],
			"strict"
		>;
	});

	it("should split an array into chunks in pipe", () => {
		const result = pipe(
			[1, 2, 3] as const,
			DArray.chunk(2),
		);

		expect(result).toEqual([[1, 2], [3]]);
	});
});
