import { DArray, pipe, type ExpectType } from "@scripts";

describe("findAndSpliceInsert", () => {
	it("should insert values before the first match without mutating the source", () => {
		const source = ["a", "ccc"] as string[] & DArray.MinElements<2>;
		const result = DArray.findAndSpliceInsert(
			source,
			(element, params) => {
				expect(params.self).toBe(source);
				return element === "ccc" && params.index === 1;
			},
			["bb"] as const,
		);

		expect(result).toEqual(["a", "bb", "ccc"]);
		expect(source).toEqual(["a", "ccc"]);

		type _CheckResult = ExpectType<
			typeof result,
			(string[] & DArray.MinElements<2>) | undefined,
			"strict"
		>;
	});

	it("should insert values before the first match in pipe", () => {
		const result = pipe(
			["a", "ccc"] as const,
			DArray.findAndSpliceInsert((value) => value === "ccc", ["bb"] as const),
		);

		expect(result).toEqual(["a", "bb", "ccc"]);
	});

	it("should return undefined when no value matches", () => {
		expect(
			DArray.findAndSpliceInsert(["a"], (value) => value === "ccc", ["bb"]),
		).toBeUndefined();
	});

	it("should discard incompatible size constraints", () => {
		const sourceMax = ["a", "ccc"] as string[] & DArray.MaxElements<2>;
		const resultMax = DArray.findAndSpliceInsert(sourceMax, () => true, ["bb"]);

		type _CheckMaxResult = ExpectType<
			typeof resultMax,
			string[] | undefined,
			"strict"
		>;

		const sourceLength = ["a", "ccc"] as string[] & DArray.LengthEqual<2>;
		const resultLength = DArray.findAndSpliceInsert(
			sourceLength,
			() => true,
			["bb"],
		);

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			string[] | undefined,
			"strict"
		>;
	});
});
