import { pipe, when, type ExpectType } from "@scripts";
import type { Negative, StrictNegative } from "@scripts/number";
import * as DNumber from "@scripts/number/isStrictNegative";

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
				number & Negative,
				"strict"
			>;

			type _CheckExpectedSource = ExpectType<
				typeof source,
				// @ts-expect-error isStrictNegative should narrow with StrictNegative.
				number & StrictNegative,
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
						number & Negative,
						"strict"
					>;

					return value - 1;
				},
			),
		);

		expect(result).toBe(-2);
	});
});
