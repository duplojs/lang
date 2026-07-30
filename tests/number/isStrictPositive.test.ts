import { pipe, when, type ExpectType } from "@scripts";
import type { StrictPositive } from "@scripts/number";
import * as DNumber from "@scripts/number/isStrictPositive";

describe("isStrictPositive", () => {
	it("should validate a strictly positive number", () => {
		expect(DNumber.isStrictPositive(1)).toBe(true);
		expect(DNumber.isStrictPositive(0)).toBe(false);
		expect(DNumber.isStrictPositive(-1)).toBe(false);
	});

	it("should narrow a number with a strict positive constraint", () => {
		const source = 1 as number;

		if (DNumber.isStrictPositive(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				number & StrictPositive,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			1 as number,
			when(
				DNumber.isStrictPositive,
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						number & StrictPositive,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(2);
	});
});
