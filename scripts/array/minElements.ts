import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";

export interface MinElements<
	GenericMin extends number,
> extends DCommon.Constraint<`array-min-elements-${GenericMin}`> {}

export function minElements<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
>(
	min: GenericMin & DNumber.ForbiddenNegative<GenericMin>,
): (
	array: GenericArray,
) => array is GenericArray & MinElements<GenericMin>;

export function minElements<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
>(
	array: GenericArray,
	min: GenericMin & DNumber.ForbiddenNegative<GenericMin>,
): array is GenericArray & MinElements<GenericMin>;

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
