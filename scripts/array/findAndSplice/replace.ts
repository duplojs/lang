import type * as DCommon from "@scripts/common";

export interface FindAndSpliceReplacePredicateFunctionParams<
	GenericArray extends readonly unknown[] = readonly unknown[],
> {
	index: number;
	self: GenericArray;
}

export function findAndSpliceReplace<
	GenericArray extends readonly unknown[],
>(
	predicate: (
		element: GenericArray[number],
		params: FindAndSpliceReplacePredicateFunctionParams<GenericArray>,
	) => boolean,
	elements: GenericArray,
): (
	array: GenericArray,
) => GenericArray | undefined;

export function findAndSpliceReplace<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FindAndSpliceReplacePredicateFunctionParams<GenericArray>,
	) => boolean,
	elements: GenericArray,
): GenericArray | undefined;

export function findAndSpliceReplace(
	...args:
		| [predicate: DCommon.AnyFunction, elements: readonly unknown[]]
		| [array: readonly unknown[], predicate: DCommon.AnyFunction, elements: readonly unknown[]]
) {
	if (args.length === 2) {
		const [predicate, elements] = args;

		return (array: readonly unknown[]) => findAndSpliceReplace(array, predicate, elements);
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
			return array.slice().splice(index, elements.length, ...elements);
		}
	}

	return undefined;
}
