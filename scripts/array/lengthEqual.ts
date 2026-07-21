import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";

export interface LengthEqual<
	GenericLength extends number,
> extends DCommon.Constraint<`array-length-equal-${GenericLength}`> {}

export type ForbiddenLengthEqual<
	GenericArray extends readonly unknown[],
> = GenericArray extends LengthEqual<number>
	? DCommon.ComputedTypeError<"Array already has exact length constraint.">
	: unknown;

export function lengthEqual<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
>(
	length: GenericLength & DNumber.ForbiddenNegative<GenericLength>,
): (
	array: GenericArray,
) => array is GenericArray & LengthEqual<GenericLength>;

export function lengthEqual<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
>(
	array: GenericArray,
	length: GenericLength & DNumber.ForbiddenNegative<GenericLength>,
): array is GenericArray & LengthEqual<GenericLength>;

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
