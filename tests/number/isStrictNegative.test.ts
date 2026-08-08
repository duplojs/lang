import { DNumber, pipe, when, type ExpectType } from "@scripts";

describe("isStrictNegative", () => {
	it("should validate a strictly negative number", () => {
		expect(DNumber.isStrictNegative(-1)).toBe(true);
		expect(DNumber.isStrictNegative(0)).toBe(false);
		expect(DNumber.isStrictNegative(1)).toBe(false);
	});

	it("should currently narrow a number with a negative constraint", () => {
		const source = -1 as number;

		if (DNumber.isStrictNegative(source)) {
			type _CheckCurrentSource = ExpectType<
				typeof source,
				number & DNumber.Negative,
				"strict"
			>;

			type _CheckExpectedSource = ExpectType<
				typeof source,
				// @ts-expect-error isStrictNegative should narrow with StrictNegative.
				number & DNumber.StrictNegative,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			-1 as number,
			when(
				DNumber.isStrictNegative,
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						number & DNumber.Negative,
						"strict"
					>;

					return value - 1;
				},
			),
		);

		expect(result).toBe(-2);
	});
});
