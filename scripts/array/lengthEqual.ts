import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import type { LengthEqual, MaxElements, MinElements } from "./constraints";

type RequireLengthEqualConstraint<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
> = GenericArray extends LengthEqual<infer InferredLength>
	? DCommon.IsEqual<GenericLength, InferredLength> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply LengthEqual<${GenericLength}> on LengthEqual<${InferredLength}>.`
		>
	: unknown;

type RequireMinElementsConstraint<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
> = GenericArray extends MinElements<infer InferredMin>
	? DNumber.IsGreaterOrEqual<GenericLength, InferredMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply LengthEqual<${GenericLength}> on MinElements<${InferredMin}>.`
		>
	: unknown;

type RequireMaxElementsConstraint<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
> = GenericArray extends MaxElements<infer InferredMax>
	? DNumber.IsGreaterOrEqual<InferredMax, GenericLength> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply LengthEqual<${GenericLength}> on MaxElements<${InferredMax}>.`
		>
	: unknown;

type RequireApplyLengthEqual<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
> = (
	& DNumber.ForbiddenNegative<GenericLength>
	& RequireLengthEqualConstraint<GenericArray, GenericLength>
	& RequireMinElementsConstraint<GenericArray, GenericLength>
	& RequireMaxElementsConstraint<GenericArray, GenericLength>
);

type IsLengthEqualCompatible<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
> = DCommon.And<[
	GenericArray extends LengthEqual<infer InferredLength>
		? DCommon.IsEqual<GenericLength, InferredLength>
		: true,
	GenericArray extends MinElements<infer InferredMin>
		? DNumber.IsGreaterOrEqual<GenericLength, InferredMin>
		: true,
	GenericArray extends MaxElements<infer InferredMax>
		? DNumber.IsGreaterOrEqual<InferredMax, GenericLength>
		: true,
]>;

type ComputeLengthEqual<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
> = GenericArray extends unknown
	? IsLengthEqualCompatible<GenericArray, GenericLength> extends true
		? GenericArray & LengthEqual<GenericLength>
		: never
	: never;

export function lengthEqual<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
>(
	length: GenericLength & RequireApplyLengthEqual<GenericArray, GenericLength>,
): (
	array: GenericArray,
) => array is ComputeLengthEqual<GenericArray, GenericLength>;

export function lengthEqual<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
>(
	array: GenericArray,
	length: GenericLength & RequireApplyLengthEqual<GenericArray, GenericLength>,
): array is ComputeLengthEqual<GenericArray, GenericLength>;

export function lengthEqual(
	...args:
		| [length: number]
		| [array: readonly unknown[], length: number]
) {
	if (args.length === 1) {
		const [length] = args;

		return (array: readonly unknown[]) => lengthEqual(array, length);
	}

	const [array, length] = args;

	return array.length === length;
}
