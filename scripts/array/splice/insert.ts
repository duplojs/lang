import type * as DCommon from "@scripts/common";

export function spliceInsert<
	GenericElements extends readonly unknown[],
>(
	indexFrom: number,
	elements: GenericElements,
): <GenericArray extends readonly unknown[]>(
	array: GenericArray,
) => DCommon.RemoveConstraint<GenericArray[number] | GenericElements[number]>[];

export function spliceInsert<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
>(
	array: GenericArray,
	indexFrom: number,
	elements: GenericElements,
): DCommon.RemoveConstraint<GenericArray[number] | GenericElements[number]>[];

export function spliceInsert(
	...args:
		| [indexFrom: number, elements: readonly unknown[]]
		| [array: readonly unknown[], indexFrom: number, elements: readonly unknown[]]
) {
	if (args.length === 2) {
		const [indexFrom, elements] = args;

		return (array: readonly unknown[]) => spliceInsert(array, indexFrom, elements);
	}

	const [array, indexFrom, elements] = args;

	const result = array.slice();
	result.splice(indexFrom, 0, ...elements);

	return result;
}
