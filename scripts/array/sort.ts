import type * as DCommon from "@scripts/common";
import type { ReapplyConstraints } from "./types";

export function sort<
	GenericArray extends readonly unknown[],
	GenericElement extends GenericArray[number] = GenericArray[number],
>(
	compareFunction: (
		first: GenericElement,
		second: GenericElement,
	) => number,
): (
	array: GenericArray,
) => ReapplyConstraints<GenericArray, GenericElement[]>;

export function sort<
	GenericArray extends readonly unknown[],
	GenericElement extends GenericArray[number] = GenericArray[number],
>(
	array: GenericArray,
	compareFunction: (
		first: GenericElement,
		second: GenericElement,
	) => number,
): ReapplyConstraints<GenericArray, GenericElement[]>;

export function sort(
	...args:
		| [compareFunction: DCommon.AnyFunction]
		| [array: readonly unknown[], compareFunction: DCommon.AnyFunction]
) {
	if (args.length === 1) {
		const [compareFunction] = args;

		return (array: readonly unknown[]) => sort(array, compareFunction);
	}

	const [array, compareFunction] = args;

	return array.slice().sort(compareFunction);
}
