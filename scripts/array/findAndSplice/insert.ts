import type * as DCommon from "@scripts/common";

export interface FindAndSpliceInsertPredicateFunctionParams<
	GenericArray extends readonly unknown[] = readonly unknown[],
> {
	index: number;
	self: GenericArray;
}

export function findAndSpliceInsert<
	GenericArray extends readonly unknown[],
>(
	predicate: (
		element: GenericArray[number],
		params: FindAndSpliceInsertPredicateFunctionParams<GenericArray>,
	) => boolean,
	elements: GenericArray,
): (
	array: GenericArray,
) => GenericArray | undefined;

export function findAndSpliceInsert<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FindAndSpliceInsertPredicateFunctionParams<GenericArray>,
	) => boolean,
	elements: GenericArray,
): GenericArray | undefined;

export function findAndSpliceInsert(
	...args:
		| [predicate: DCommon.AnyFunction, elements: readonly unknown[]]
		| [array: readonly unknown[], predicate: DCommon.AnyFunction, elements: readonly unknown[]]
) {
	if (args.length === 2) {
		const [predicate, elements] = args;

		return (array: readonly unknown[]) => findAndSpliceInsert(array, predicate, elements);
	}

	const [array, predicate, elements] = args;

	for (let index = 0; index < array.length; index++) {
		if (
			predicate(
				array[index],
				{
					index,
					self: array,
				},
			)
		) {
			return array.slice().splice(index, 0, ...elements);
		}
	}

	return undefined;
}
