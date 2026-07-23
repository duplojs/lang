import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import type { LengthEqual, MaxElements, MinElements } from "./constraints";

type RequireApplyMinElements<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
> = GenericArray extends LengthEqual<infer InferredLength>
	? DNumber.IsGreaterOrEqual<InferredLength, GenericMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MinElements<${GenericMin}> on LengthEqual<${InferredLength}>.`
		>
	: GenericArray extends MaxElements<infer InferredMax>
		? DNumber.IsGreaterOrEqual<InferredMax, GenericMin> extends true
			? unknown
			: DCommon.ComputedTypeError<
				`Cannot apply MinElements<${GenericMin}> on MaxElements<${InferredMax}>.`
			>
		: unknown;

type IsMinElementsCovered<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
> =
	GenericArray extends LengthEqual<infer InferredLength>
		? DNumber.IsGreaterOrEqual<InferredLength, GenericMin>
		: GenericArray extends MinElements<infer InferredMin>
			? DNumber.IsGreaterOrEqual<InferredMin, GenericMin>
			: false;

type ApplyMinElementsGuard<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
> = DCommon.IsUnion<GenericArray> extends true
	? GenericArray extends unknown
		? IsMinElementsCovered<GenericArray, GenericMin> extends true
			? GenericArray & MinElements<GenericMin>
			: never
		: never
	: GenericArray & MinElements<GenericMin>;

export function minElements<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
>(
	min: GenericMin & DNumber.ForbiddenNegative<GenericMin> & RequireApplyMinElements<GenericArray, GenericMin>,
): (
	array: GenericArray,
) => array is ApplyMinElementsGuard<GenericArray, GenericMin>;

export function minElements<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
>(
	array: GenericArray,
	min: GenericMin & DNumber.ForbiddenNegative<GenericMin> & RequireApplyMinElements<GenericArray, GenericMin>,
): array is ApplyMinElementsGuard<GenericArray, GenericMin>;

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
