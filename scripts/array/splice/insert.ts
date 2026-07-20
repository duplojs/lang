export function spliceInsert<
	GenericElement extends unknown,
>(
	indexFrom: number,
	elements: readonly GenericElement[],
): (
	array: readonly GenericElement[],
) => GenericElement[];

export function spliceInsert<
	GenericElement extends unknown,
>(
	array: readonly GenericElement[],
	indexFrom: number,
	elements: readonly GenericElement[],
): GenericElement[];

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

	return array.slice().splice(indexFrom, 0, ...elements);
}
