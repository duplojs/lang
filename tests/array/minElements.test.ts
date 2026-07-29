import { DArray, pipe, type ExpectType } from "@scripts";

describe("minElements", () => {
	it("should validate an array longer than the minimum", () => {
		expect(DArray.minElements(["a", "b", "c"], 3)).toBe(true);
		expect(DArray.minElements(["a", "b"], 3)).toBe(false);
	});

	it("should validate an array in pipe", () => {
		const result = pipe(
			["a", "b", "c"],
			DArray.minElements(3),
		);

		expect(result).toBe(true);
	});

	it("should narrow the array with a min elements constraint", () => {
		const source = ["a", "b", "c"] as string[];

		if (DArray.minElements(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				string[] & DArray.MinElements<3>,
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				string[],
				"strict"
			>;
		}
	});

	it("should discriminate compatible size constraints", () => {
		const source = [1, 2, 3] as
			| (string[] & DArray.MinElements<2>)
			| (number[] & DArray.MinElements<5>)
			| (boolean[] & DArray.LengthEqual<4>)
			| (symbol[] & DArray.MaxElements<2>)
			| (bigint[] & DArray.MaxElements<5>);

		if (DArray.minElements(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				| (number[] & DArray.MinElements<5>)
				| (string[] & DArray.MinElements<2> & DArray.MinElements<3>)
				| (boolean[] & DArray.LengthEqual<4>)
				| (bigint[] & DArray.MaxElements<5> & DArray.MinElements<3>),
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				| (string[] & DArray.MinElements<2>)
				| (symbol[] & DArray.MaxElements<2>)
				| (bigint[] & DArray.MaxElements<5>),
				"strict"
			>;
		}
	});

	it("should reject incompatible min elements constraints", () => {
		const sourceMax = ["a", "b"] as string[] & DArray.MaxElements<2>;
		const sourceLength = ["a", "b"] as string[] & DArray.LengthEqual<2>;

		// @ts-expect-error Cannot apply MinElements<3> on MaxElements<2>.
		expect(DArray.minElements(sourceMax, 3)).toBe(false);

		// @ts-expect-error Cannot apply MinElements<3> on LengthEqual<2>.
		expect(DArray.minElements(sourceLength, 3)).toBe(false);
	});
});
