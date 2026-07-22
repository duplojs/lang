import type * as DNumber from "@scripts/number";
import type { MaxElements } from "./constraints";

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
