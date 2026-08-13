import { DCommon, type ExpectType, pipe } from "@scripts";

describe("asserts", () => {
	it("narrows the input when the predicate accepts it", () => {
		const input = "value" as string | number;

		DCommon.asserts(
			input,
			(value): value is string => typeof value === "string",
		);

		type _CheckInput = ExpectType<
			typeof input,
			string,
			"strict"
		>;

		expect(input.toUpperCase()).toBe("VALUE");
	});

	it("throws a typed error when the predicate rejects the input", () => {
		expect(
			() => DCommon.asserts(
				10 as string | number,
				(value): value is string => typeof value === "string",
			),
		).toThrowError(DCommon.AssertsError);
	});

	it("forwards the narrowed input", () => {
		const input = "value" as string | number;
		const result = DCommon.forwardAsserts(
			input,
			(value): value is string => typeof value === "string",
		);

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("value");
	});

	it("throws a typed error when forward asserts rejects the input", () => {
		expect(
			() => DCommon.forwardAsserts(
				10 as string | number,
				(value): value is string => typeof value === "string",
			),
		).toThrowError(DCommon.AssertsError);
	});

	it("supports forward asserts in a pipe", () => {
		const result = pipe(
			"value" as string | number,
			DCommon.forwardAsserts(
				(value): value is string => typeof value === "string",
			),
			(input) => input.length,
		);

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;

		expect(result).toBe(5);
	});
});
