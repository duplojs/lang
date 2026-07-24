import type * as DCommon from "@scripts/common";
import type { ReapplyAllSizeConstraints } from "../constraints";

export interface FindAndSpliceInsertPredicateFunctionParams<
	GenericArray extends readonly unknown[] = readonly unknown[],
> {
	index: number;
	self: GenericArray;
}

type FindAndSpliceInsertOutput<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
> =
	| ReapplyAllSizeConstraints<
		GenericArray,
		(
			| GenericArray[number]
			| GenericElements[number]
		)[],
		"lengthEqual" | "maxElements"
	>
	| undefined;

export function findAndSpliceInsert<
	GenericElements extends readonly unknown[],
>(
	predicate: (
		element: unknown,
		params: FindAndSpliceInsertPredicateFunctionParams,
	) => boolean,
	elements: GenericElements,
): <GenericArray extends readonly unknown[]>(
	array: GenericArray,
) => FindAndSpliceInsertOutput<GenericArray, GenericElements>;

export function findAndSpliceInsert<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FindAndSpliceInsertPredicateFunctionParams<GenericArray>,
	) => boolean,
	elements: GenericElements,
): FindAndSpliceInsertOutput<GenericArray, GenericElements>;

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
			const result = array.slice();
			// Use a loop if spread inputs can become large.
			result.splice(index, 0, ...elements);

			return result;
		}
	}

	return undefined;
}
