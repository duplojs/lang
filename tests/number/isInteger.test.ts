import { pipe, when, type ExpectType } from "@scripts";
import type { Integer } from "@scripts/number";
import * as DNumber from "@scripts/number/isInteger";

describe("isInteger", () => {
	it("should validate an integer", () => {
		expect(DNumber.isInteger(3)).toBe(true);
		expect(DNumber.isInteger(3.1)).toBe(false);
	});

	it("should narrow a number with an integer constraint", () => {
		const source = 3 as number;

		if (DNumber.isInteger(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				number & Integer,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			3 as number,
			when(
				DNumber.isInteger,
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						number & Integer,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(4);
	});
});
