import type * as DCommon from "@scripts/common";

export interface FindAndSpliceDeletePredicateFunctionParams<
	GenericArray extends readonly unknown[] = readonly unknown[],
> {
	index: number;
	self: GenericArray;
}

export function findAndSpliceDelete<
	GenericArray extends readonly unknown[],
>(
	predicate: (
		element: GenericArray[number],
		params: FindAndSpliceDeletePredicateFunctionParams<GenericArray>,
	) => boolean,
	deleteCount: number,
): (
	array: GenericArray,
) => GenericArray[number][] | undefined;

export function findAndSpliceDelete<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FindAndSpliceDeletePredicateFunctionParams<GenericArray>,
	) => boolean,
	deleteCount: number,
): GenericArray[number][] | undefined;

export function findAndSpliceDelete(
	...args:
		| [predicate: DCommon.AnyFunction, deleteCount: number]
		| [array: readonly unknown[], predicate: DCommon.AnyFunction, deleteCount: number]
) {
	if (args.length === 2) {
		const [predicate, deleteCount] = args;

		return (array: readonly unknown[]) => findAndSpliceDelete(array, predicate, deleteCount);
	}

	const [array, predicate, deleteCount] = args;

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
			const result = array.slice();
			result.splice(index, deleteCount);

			return result;
		}
	}

	return undefined;
}
