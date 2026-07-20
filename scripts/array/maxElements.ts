import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";

export interface MaxElements<
	GenericMax extends number,
> extends DCommon.Constraint<`array-max-elements-${GenericMax}`> {}

export function maxElements<
	GenericArray extends readonly unknown[],
	GenericMax extends number,
>(
	max: GenericMax & DNumber.ForbiddenNegative<GenericMax>,
): (
	array: GenericArray,
) => array is GenericArray & MaxElements<GenericMax>;

export function maxElements<
	GenericArray extends readonly unknown[],
	GenericMax extends number,
>(
	array: GenericArray,
	max: GenericMax & DNumber.ForbiddenNegative<GenericMax>,
): array is GenericArray & MaxElements<GenericMax>;

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
