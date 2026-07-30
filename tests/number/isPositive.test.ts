import { pipe, when, type ExpectType } from "@scripts";
import type { Positive } from "@scripts/number";
import * as DNumber from "@scripts/number/isPositive";

describe("isPositive", () => {
	it("should validate a positive number including zero", () => {
		expect(DNumber.isPositive(1)).toBe(true);
		expect(DNumber.isPositive(0)).toBe(true);
		expect(DNumber.isPositive(-1)).toBe(false);
	});

	it("should narrow a number with a positive constraint", () => {
		const source = 1 as number;

		if (DNumber.isPositive(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				number & Positive,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			1 as number,
			when(
				DNumber.isPositive,
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						number & Positive,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(2);
	});
});
