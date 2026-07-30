import { pipe, when, type ExpectType } from "@scripts";
import type { Finite } from "@scripts/number";
import * as DNumber from "@scripts/number/isFinite";

describe("isFinite", () => {
	it("should validate a finite number", () => {
		expect(DNumber.isFinite(3)).toBe(true);
		expect(DNumber.isFinite(Number.POSITIVE_INFINITY)).toBe(false);
		expect(DNumber.isFinite(Number.NaN)).toBe(false);
	});

	it("should narrow a number with a finite constraint", () => {
		const source = 3 as number;

		if (DNumber.isFinite(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				number & Finite,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			3 as number,
			when(
				DNumber.isFinite,
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						number & Finite,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(4);
	});
});
