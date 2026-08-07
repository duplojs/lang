import { type DNumber } from "@scripts";

describe("IsPositiveInteger", () => {
	it("should validate literal numbers", () => {
		const _checkNumber = expectTypeOf<
			DNumber.IsPositiveInteger<number>
		>().toEqualTypeOf<false>();

		const _checkPositiveInteger = expectTypeOf<
			DNumber.IsPositiveInteger<1>
		>().toEqualTypeOf<true>();

		const _checkZero = expectTypeOf<
			DNumber.IsPositiveInteger<0>
		>().toEqualTypeOf<true>();

		const _checkNegativeInteger = expectTypeOf<
			DNumber.IsPositiveInteger<-1>
		>().toEqualTypeOf<false>();

		const _checkDecimal = expectTypeOf<
			DNumber.IsPositiveInteger<1.1>
		>().toEqualTypeOf<false>();
	});

	it("should validate unions only when every member is a positive integer", () => {
		const _checkValidUnion = expectTypeOf<
			DNumber.IsPositiveInteger<0 | 1>
		>().toEqualTypeOf<true>();

		const _checkUnionWithNegative = expectTypeOf<
			DNumber.IsPositiveInteger<1 | -1>
		>().toEqualTypeOf<false>();

		const _checkUnionWithDecimal = expectTypeOf<
			DNumber.IsPositiveInteger<1 | 1.1>
		>().toEqualTypeOf<false>();
	});

	it("should require both positive and integer guarantees on constrained numbers", () => {
		const _checkOnlyPositive = expectTypeOf<
			DNumber.IsPositiveInteger<number & DNumber.Positive>
		>().toEqualTypeOf<false>();

		const _checkOnlyStrictPositive = expectTypeOf<
			DNumber.IsPositiveInteger<number & DNumber.StrictPositive>
		>().toEqualTypeOf<false>();

		const _checkOnlyInteger = expectTypeOf<
			DNumber.IsPositiveInteger<number & DNumber.Integer>
		>().toEqualTypeOf<false>();

		const _checkOnlyEven = expectTypeOf<
			DNumber.IsPositiveInteger<number & DNumber.Even>
		>().toEqualTypeOf<false>();
	});

	it("should validate equivalent constrained numbers", () => {
		const _checkPositiveInteger = expectTypeOf<
			DNumber.IsPositiveInteger<number & DNumber.Positive & DNumber.Integer>
		>().toEqualTypeOf<true>();

		const _checkGreaterThanInteger = expectTypeOf<
			DNumber.IsPositiveInteger<
				number & DNumber.GreaterThan<0> & DNumber.Integer
			>
		>().toEqualTypeOf<true>();

		const _checkGreaterThanOrEqualInteger = expectTypeOf<
			DNumber.IsPositiveInteger<
				number & DNumber.GreaterThanOrEqual<0> & DNumber.Integer
			>
		>().toEqualTypeOf<true>();
	});
});
