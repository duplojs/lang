import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import type { LengthEqual, MaxElements, MinElements } from "./constraints";

type RequireLengthEqualConstraint<
	GenericArray extends readonly unknown[],
	GenericMax extends number,
> = GenericArray extends LengthEqual<infer InferredLength>
	? DNumber.IsGreaterOrEqual<GenericMax, InferredLength> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MaxElements<${GenericMax}> on LengthEqual<${InferredLength}>.`
		>
	: unknown;

type RequireMinElementsConstraint<
	GenericArray extends readonly unknown[],
	GenericMax extends number,
> = GenericArray extends MinElements<infer InferredMin>
	? DNumber.IsGreaterOrEqual<GenericMax, InferredMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MaxElements<${GenericMax}> on MinElements<${InferredMin}>.`
		>
	: unknown;

type RequireApplyMaxElements<
	GenericArray extends readonly unknown[],
	GenericMax extends number,
> = (
	& DNumber.ForbiddenNegative<GenericMax>
	& RequireLengthEqualConstraint<GenericArray, GenericMax>
	& RequireMinElementsConstraint<GenericArray, GenericMax>
);

type ComputeMaxElements<
	GenericArray extends readonly unknown[],
	GenericMax extends number,
> = GenericArray extends LengthEqual<infer InferredLength>
	? DNumber.IsGreaterOrEqual<GenericMax, InferredLength> extends true
		? GenericArray
		: never
	: GenericArray extends MinElements<infer InferredMin>
		? DNumber.IsGreaterOrEqual<GenericMax, InferredMin> extends true
			? GenericArray & MaxElements<GenericMax>
			: never
		: GenericArray extends MaxElements<infer InferredMax>
			? DNumber.IsGreaterOrEqual<GenericMax, InferredMax> extends true
				? GenericArray
				: GenericArray & MaxElements<GenericMax>
			: GenericArray & MaxElements<GenericMax>;

export function maxElements<
	GenericArray extends readonly unknown[],
	GenericMax extends number,
>(
	max: GenericMax & RequireApplyMaxElements<GenericArray, GenericMax>,
): (
	array: GenericArray,
) => array is ComputeMaxElements<GenericArray, GenericMax>;

export function maxElements<
	GenericArray extends readonly unknown[],
	GenericMax extends number,
>(
	array: GenericArray,
	max: GenericMax & RequireApplyMaxElements<GenericArray, GenericMax>,
): array is ComputeMaxElements<GenericArray, GenericMax>;

export function maxElements(
	...args:
		| [max: number]
		| [array: readonly unknown[], max: number]
) {
	if (args.length === 1) {
		const [max] = args;

		return (array: readonly unknown[]) => maxElements(array, max);
	}

	const [array, max] = args;

	return array.length <= max;
}

const source = [1] as
	| (string[] & MaxElements<2>)
	| (number[] & MaxElements<5>)
	| (boolean[] & LengthEqual<4>)
	| (symbol[] & MinElements<2>)
	| (bigint[] & MinElements<5>);

if (maxElements(source, 3)) {
	type check = DCommon.ExpectType<
		typeof source,
		| (string[] & MaxElements<2>)
		| (number[] & MaxElements<5> & MaxElements<3>)
		| (symbol[] & MinElements<2> & MaxElements<3>),
		"strict"
	>;
} else {
	type check = DCommon.ExpectType<
		typeof source,
		| (number[] & MaxElements<5>)
		| (boolean[] & LengthEqual<4>)
		| (symbol[] & MinElements<2>)
		| (bigint[] & MinElements<5>),
		"strict"
	>;
}
