import type * as DCommon from "@scripts/common";

export function spliceDelete(
	indexTo: number,
	deleteCount: number,
): <GenericArray extends readonly unknown[]>(
	array: GenericArray,
) => DCommon.RemoveConstraint<GenericArray[number]>[];

export function spliceDelete<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	indexTo: number,
	deleteCount: number,
): DCommon.RemoveConstraint<GenericArray[number]>[];

export function spliceDelete(
	...args:
		| [indexTo: number, deleteCount: number]
		| [array: readonly unknown[], indexTo: number, deleteCount: number]
) {
	if (args.length === 2) {
		const [indexTo, deleteCount] = args;

		return (array: readonly unknown[]) => spliceDelete(array, indexTo, deleteCount);
	}

	const [array, indexTo, deleteCount] = args;

	const result = array.slice();
	result.splice(indexTo, deleteCount);

	return result;
}
