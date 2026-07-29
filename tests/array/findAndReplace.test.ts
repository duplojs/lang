import { DArray, pipe, type ExpectType } from "@scripts";

describe("findAndReplace", () => {
	it("should replace the first matching value without mutating the source", () => {
		const source = ["a", "bb", "ccc"] as
			& string[]
			& DArray.LengthEqual<3>
			& DArray.MinElements<3>
			& DArray.MaxElements<3>;
		const result = DArray.findAndReplace(
			source,
			(element, params) => {
				expect(params.self).toBe(source);
				return params.index === 1 && element === "bb";
			},
			0,
		);

		expect(result).toEqual(["a", 0, "ccc"]);
		expect(source).toEqual(["a", "bb", "ccc"]);

		type _CheckResult = ExpectType<
			typeof result,
			(
				& (string | 0)[]
				& DArray.LengthEqual<3>
				& DArray.MinElements<3>
				& DArray.MaxElements<3>
			) | undefined,
			"strict"
		>;
	});

	it("should replace the first matching value in pipe", () => {
		const result = pipe(
			["a", "bb"] as const,
			DArray.findAndReplace((value) => value === "bb", "replaced"),
		);

		expect(result).toEqual(["a", "replaced"]);
	});

	it("should return undefined when no value matches", () => {
		expect(
			DArray.findAndReplace(["a", "bb"], (value) => value === "ccc", "replaced"),
		).toBeUndefined();
	});
});
