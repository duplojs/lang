import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import type { LengthEqual, MaxElements, MinElements } from "./constraints";

type RequireLengthEqualConstraint<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
> = GenericArray extends LengthEqual<infer InferredLength>
	? DNumber.IsGreaterOrEqual<InferredLength, GenericMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MinElements<${GenericMin}> on LengthEqual<${InferredLength}>.`
		>
	: unknown;

type RequireMaxElementsConstraint<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
> = GenericArray extends MaxElements<infer InferredMax>
	? DNumber.IsGreaterOrEqual<InferredMax, GenericMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MinElements<${GenericMin}> on MaxElements<${InferredMax}>.`
		>
	: unknown;

type RequireApplyMinElements<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
> = (
	& DNumber.ForbiddenNegative<GenericMin>
	& RequireLengthEqualConstraint<GenericArray, GenericMin>
	& RequireMaxElementsConstraint<GenericArray, GenericMin>
);

type ComputeMinElements<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
> = GenericArray extends LengthEqual<infer InferredLength>
	? DNumber.IsGreaterOrEqual<InferredLength, GenericMin> extends true
		? GenericArray
		: never
	: GenericArray extends MaxElements<infer InferredMax>
		? DNumber.IsGreaterOrEqual<InferredMax, GenericMin> extends true
			? GenericArray & MinElements<GenericMin>
			: never
		: GenericArray extends MinElements<infer InferredMin>
			? DNumber.IsGreaterOrEqual<InferredMin, GenericMin> extends true
				? GenericArray
				: GenericArray & MinElements<GenericMin>
			: GenericArray & MinElements<GenericMin>;

export function minElements<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
>(
	min: GenericMin & RequireApplyMinElements<GenericArray, GenericMin>,
): (
	array: GenericArray,
) => array is ComputeMinElements<GenericArray, GenericMin>;

export function minElements<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
>(
	array: GenericArray,
	min: GenericMin & RequireApplyMinElements<GenericArray, GenericMin>,
): array is ComputeMinElements<GenericArray, GenericMin>;

export function minElements(
	...args:
		| [min: number]
		| [array: readonly unknown[], min: number]
) {
	if (args.length === 1) {
		const [min] = args;

		return (array: readonly unknown[]) => minElements(array, min);
	}

	const [array, min] = args;

	return array.length >= min;
}

const source = [1] as
	| (string[] & MinElements<2>)
	| (number[] & MinElements<5>)
	| (boolean[] & LengthEqual<4>)
	| (symbol[] & MaxElements<2>)
	| (bigint[] & MaxElements<5>);

if (minElements(source, 3)) {
	type check = DCommon.ExpectType<
		typeof source,
		| (number[] & MinElements<5>)
		| (string[] & MinElements<2> & MinElements<3>)
		| (boolean[] & LengthEqual<4>)
		| (bigint[] & MaxElements<5> & MinElements<3>),
		"strict"
	>;
} else {
	type check = DCommon.ExpectType<
		typeof source,
		| (string[] & MinElements<2>)
		| (symbol[] & MaxElements<2>)
		| (bigint[] & MaxElements<5>),
		"strict"
	>;
}
