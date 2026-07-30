import { pipe, when, type ExpectType } from "@scripts";
import type { Odd } from "@scripts/number";
import * as DNumber from "@scripts/number/isOdd";

describe("isOdd", () => {
	it("should validate an odd number", () => {
		expect(DNumber.isOdd(3)).toBe(true);
		expect(DNumber.isOdd(2)).toBe(false);
	});

	it("should narrow a number with an odd constraint", () => {
		const source = 3 as number;

		if (DNumber.isOdd(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				number & Odd,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			3 as number,
			when(
				DNumber.isOdd,
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						number & Odd,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(4);
	});
});
