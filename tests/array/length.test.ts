import { DArray, type DNumber, type ExpectType } from "@scripts";

describe("length", () => {
	it("should return the length of a wide array", () => {
		const result = DArray.length(["a", "b"]);

		expect(result).toBe(2);

		type _CheckResult = ExpectType<
			typeof result,
			number & DNumber.Positive,
			"strict"
		>;
	});

	it("should preserve tuple length", () => {
		const result = DArray.length(["a", "b"] as const);

		type _CheckResult = ExpectType<
			typeof result,
			2 & DNumber.StrictPositive,
			"strict"
		>;
	});

	it("should preserve empty tuple length", () => {
		const result = DArray.length([] as const);

		type _CheckResult = ExpectType<
			typeof result,
			0 & DNumber.Positive,
			"strict"
		>;
	});
});
