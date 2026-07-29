import { DArray, pipe, type ExpectType } from "@scripts";

describe("fill", () => {
	it("should fill a range without mutating the source", () => {
		const source = [1, 2, 3, 4] as
			& number[]
			& DArray.LengthEqual<4>
			& DArray.MinElements<4>
			& DArray.MaxElements<4>;
		const result = DArray.fill(source, "x", 1, 3);

		expect(result).toEqual([1, "x", "x", 4]);
		expect(source).toEqual([1, 2, 3, 4]);

		type _CheckResult = ExpectType<
			typeof result,
			(number | string)[] & DArray.LengthEqual<4> & DArray.MinElements<4> & DArray.MaxElements<4>,
			"strict"
		>;
	});

	it("should fill a range in pipe", () => {
		const result = pipe(
			[1, 2, 3] as const,
			DArray.fill("x", 1, 2),
		);

		expect(result).toEqual([1, "x", 3]);
	});
});
