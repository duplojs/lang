import { DArray, DGenerator, pipe, type ExpectType } from "@scripts";

describe("chunk", () => {
	it("splits iterable values into chunks", () => {
		const result = DGenerator.chunk([1, 2, 3, 4, 5], 2);

		expect(DArray.from(result)).toStrictEqual([[1, 2], [3, 4], [5]]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<(1 | 2 | 3 | 4 | 5)[], unknown, unknown>,
			"strict"
		>;
	});

	it("splits values in pipe", () => {
		const result = pipe(
			new Set(["a", "b", "c", "d"]),
			DGenerator.chunk(2),
		);

		expect(DArray.from(result)).toStrictEqual([["a", "b"], ["c", "d"]]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<string[], unknown, unknown>,
			"strict"
		>;
	});

	it("returns no chunks for an empty iterable", () => {
		const result = DGenerator.chunk([] as number[], 3);

		expect(DArray.from(result)).toStrictEqual([]);
	});
});
