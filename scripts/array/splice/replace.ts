export function spliceReplace<
	GenericElement extends unknown,
>(
	indexFrom: number,
	elements: readonly GenericElement[],
): (
	array: readonly GenericElement[],
) => GenericElement[];

export function spliceReplace<
	GenericElement extends unknown,
>(
	array: readonly GenericElement[],
	indexFrom: number,
	elements: readonly GenericElement[],
): GenericElement[];

export function spliceReplace(
	...args:
		| [indexFrom: number, elements: readonly unknown[]]
		| [array: readonly unknown[], indexFrom: number, elements: readonly unknown[]]
) {
	if (args.length === 2) {
		const [indexFrom, elements] = args;

		return (array: readonly unknown[]) => spliceReplace(array, indexFrom, elements);
	}

	const [array, indexFrom, elements] = args;

	return array.slice().splice(indexFrom, elements.length, ...elements);
}
