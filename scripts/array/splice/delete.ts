export function spliceDelete<
	GenericArray extends readonly unknown[],
>(
	indexTo: number,
	deleteCount: number,
): (
	array: GenericArray,
) => GenericArray;

export function spliceDelete<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	indexTo: number,
	deleteCount: number,
): GenericArray;

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

	return array.slice().splice(indexTo, deleteCount);
}
