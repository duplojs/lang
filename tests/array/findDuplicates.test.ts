import { DArray, DChrono, type DCommon, type ExpectType } from "@scripts";

describe("findDuplicates", () => {
	it("should return duplicated values once", () => {
		const result = DArray.findDuplicates(["a", "b", "a", "b", "a"] as const);

		expect(result).toEqual(["a", "b"]);

		type _CheckResult = ExpectType<
			typeof result,
			DCommon.AnyTuple<"a" | "b"> | undefined,
			"strict"
		>;
	});

	it("should return undefined when no value is duplicated", () => {
		expect(DArray.findDuplicates(["a", "b", "c"])).toBeUndefined();
	});

	it("should handle null and undefined duplicates", () => {
		expect(DArray.findDuplicates([null, undefined, null, undefined])).toEqual([
			null,
			undefined,
		]);
	});

	it("should compare chrono values by serialized value", () => {
		const firstDate = DChrono.TheDate.new(0);
		const secondDate = DChrono.TheDate.new(0);
		const firstTime = DChrono.TheTime.new(0);
		const secondTime = DChrono.TheTime.new(0);

		expect(DArray.findDuplicates([
			firstDate,
			secondDate,
			firstTime,
			secondTime,
		])).toEqual([
			firstDate,
			firstTime,
		]);
	});
});
