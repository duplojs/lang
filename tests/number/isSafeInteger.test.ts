import { pipe, when, type ExpectType } from "@scripts";
import type { SafeInteger } from "@scripts/number";
import * as DNumber from "@scripts/number/isSafeInteger";

describe("isSafeInteger", () => {
	it("should validate a safe integer", () => {
		expect(DNumber.isSafeInteger(3)).toBe(true);
		expect(DNumber.isSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
		expect(DNumber.isSafeInteger(3.1)).toBe(false);
	});

	it("should narrow a number with a safe integer constraint", () => {
		const source = 3 as number;

		if (DNumber.isSafeInteger(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				number & SafeInteger,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			3 as number,
			when(
				DNumber.isSafeInteger,
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						number & SafeInteger,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(4);
	});
});
