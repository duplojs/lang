import { DArray, type ExpectType } from "@scripts";

describe("reverse", () => {
	it("should reverse values without mutating the source", () => {
		const source = [1, 2, 3] as
			& number[]
			& DArray.LengthEqual<3>
			& DArray.MinElements<3>
			& DArray.MaxElements<3>;
		const result = DArray.reverse(source);

		expect(result).toEqual([3, 2, 1]);
		expect(source).toEqual([1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			number[] & DArray.LengthEqual<3> & DArray.MinElements<3> & DArray.MaxElements<3>,
			"strict"
		>;
	});
});
