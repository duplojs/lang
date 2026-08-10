import { DArray, DGenerator, pipe, type ExpectType } from "@scripts";

describe("asyncChunk", () => {
	it("splits async iterable values into chunks", async() => {
		const input = (async function *() {
			yield await Promise.resolve(1 as const);
			yield await Promise.resolve(2 as const);
			yield await Promise.resolve(3 as const);
			yield await Promise.resolve(4 as const);
			yield await Promise.resolve(5 as const);
		})();
		const result = DGenerator.asyncChunk(input, 2);

		await expect(DArray.from(result)).resolves.toStrictEqual([[1, 2], [3, 4], [5]]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<(1 | 2 | 3 | 4 | 5)[], unknown, unknown>,
			"strict"
		>;
	});

	it("splits async values in pipe", async() => {
		const result = pipe(
			(async function *() {
				yield await Promise.resolve("a" as const);
				yield await Promise.resolve("b" as const);
				yield await Promise.resolve("c" as const);
				yield await Promise.resolve("d" as const);
			})(),
			DGenerator.asyncChunk(2),
		);

		await expect(DArray.from(result)).resolves.toStrictEqual([["a", "b"], ["c", "d"]]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<("a" | "b" | "c" | "d")[], unknown, unknown>,
			"strict"
		>;
	});
});
