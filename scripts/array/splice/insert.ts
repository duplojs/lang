import type { ReapplyAllSizeConstraints } from "../constraints";

type SpliceInsertOutput<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
> = ReapplyAllSizeConstraints<
	GenericArray,
	(
		| GenericArray[number]
		| GenericElements[number]
	)[],
	"lengthEqual" | "maxElements"
>;

export function spliceInsert<
	GenericElements extends readonly unknown[],
>(
	indexFrom: number,
	elements: GenericElements,
): <GenericArray extends readonly unknown[]>(
	array: GenericArray,
) => SpliceInsertOutput<GenericArray, GenericElements>;

export function spliceInsert<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
>(
	array: GenericArray,
	indexFrom: number,
	elements: GenericElements,
): SpliceInsertOutput<GenericArray, GenericElements>;

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
	// Use a loop if spread inputs can become large.
	result.splice(indexFrom, 0, ...elements);

	return result;
}
