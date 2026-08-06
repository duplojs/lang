import { type DNumber, type ExpectType } from "@scripts";

describe("IsPositiveInteger", () => {
	it("should validate literal numbers", () => {
		type _CheckNumber = ExpectType<
			DNumber.IsPositiveInteger<number>,
			false,
			"strict"
		>;

		type _CheckPositiveInteger = ExpectType<
			DNumber.IsPositiveInteger<1>,
			true,
			"strict"
		>;

		type _CheckZero = ExpectType<
			DNumber.IsPositiveInteger<0>,
			true,
			"strict"
		>;

		type _CheckNegativeInteger = ExpectType<
			DNumber.IsPositiveInteger<-1>,
			false,
			"strict"
		>;

		type _CheckDecimal = ExpectType<
			DNumber.IsPositiveInteger<1.1>,
			false,
			"strict"
		>;
	});

	it("should validate unions only when every member is a positive integer", () => {
		type _CheckValidUnion = ExpectType<
			DNumber.IsPositiveInteger<0 | 1>,
			true,
			"strict"
		>;

		type _CheckUnionWithNegative = ExpectType<
			DNumber.IsPositiveInteger<1 | -1>,
			false,
			"strict"
		>;

		type _CheckUnionWithDecimal = ExpectType<
			DNumber.IsPositiveInteger<1 | 1.1>,
			false,
			"strict"
		>;
	});

	it("should require both positive and integer guarantees on constrained numbers", () => {
		type _CheckOnlyPositive = ExpectType<
			DNumber.IsPositiveInteger<number & DNumber.Positive>,
			false,
			"strict"
		>;

		type _CheckOnlyStrictPositive = ExpectType<
			DNumber.IsPositiveInteger<number & DNumber.StrictPositive>,
			false,
			"strict"
		>;

		type _CheckOnlyInteger = ExpectType<
			DNumber.IsPositiveInteger<number & DNumber.Integer>,
			false,
			"strict"
		>;

		type _CheckOnlySafeInteger = ExpectType<
			DNumber.IsPositiveInteger<number & DNumber.SafeInteger>,
			false,
			"strict"
		>;

		type _CheckOnlyEven = ExpectType<
			DNumber.IsPositiveInteger<number & DNumber.Even>,
			false,
			"strict"
		>;
	});

	it("should validate equivalent constrained numbers", () => {
		type _CheckPositiveInteger = ExpectType<
			DNumber.IsPositiveInteger<number & DNumber.Positive & DNumber.Integer>,
			true,
			"strict"
		>;

		type _CheckStrictPositiveSafeInteger = ExpectType<
			DNumber.IsPositiveInteger<number & DNumber.StrictPositive & DNumber.SafeInteger>,
			true,
			"strict"
		>;

		type _CheckGreaterThanInteger = ExpectType<
			DNumber.IsPositiveInteger<number & DNumber.GreaterThan<0> & DNumber.Integer>,
			true,
			"strict"
		>;

		type _CheckGreaterThanOrEqualInteger = ExpectType<
			DNumber.IsPositiveInteger<number & DNumber.GreaterThanOrEqual<0> & DNumber.Integer>,
			true,
			"strict"
		>;
	});
});
