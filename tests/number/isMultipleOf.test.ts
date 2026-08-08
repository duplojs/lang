import { DNumber, pipe, when, type ExpectType } from "@scripts";

describe("isMultipleOf", () => {
	it("should validate a multiple", () => {
		expect(DNumber.isMultipleOf(6, 3)).toBe(true);
		expect(DNumber.isMultipleOf(7, 3)).toBe(false);
	});

	it("should validate a multiple with curry", () => {
		const predicate = DNumber.isMultipleOf(3);

		expect(predicate(6)).toBe(true);
		expect(predicate(7)).toBe(false);
	});

	it("should narrow a number with a multiple constraint", () => {
		const source = 6 as number;

		if (DNumber.isMultipleOf(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				number & DNumber.MultipleOf<3>,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			6 as number,
			when(
				DNumber.isMultipleOf(3),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						number & DNumber.MultipleOf<3>,
						"strict"
					>;

					return value / 3;
				},
			),
		);

		expect(result).toBe(2);
	});

	it("should reject a non literal multiple for the direct signature", () => {
		const multiple = 3 as number;

		if (false) {
			// @ts-expect-error direct signature expects a literal multiple.
			DNumber.isMultipleOf(6, multiple);
		}
	});
});
