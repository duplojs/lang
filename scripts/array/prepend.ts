export function prepend<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
>(
	elements: GenericElements,
): (
	array: GenericArray,
) => (
	| GenericElements[number]
	| GenericArray[number]
)[];

export function prepend<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
	GenericElementsRest extends readonly unknown[][],
>(
	array: GenericArray,
	elements: GenericElements,
	...elementsRest: GenericElementsRest
): (
	| GenericElements[number]
	| GenericElementsRest[number][number]
	| GenericArray[number]
)[];

export function prepend(
	...args:
		| [elements: readonly unknown[]]
		| [array: readonly unknown[], elements: readonly unknown[], ...elementsRest: readonly unknown[][]]
) {
	if (args.length === 1) {
		const [elements] = args;

		return (array: readonly unknown[]) => prepend(array, elements);
	}

	const [array, elements, ...elementsRest] = args as [
		readonly unknown[],
		readonly unknown[],
		...readonly unknown[][],
	];

	// Use a loop if spread inputs can become large.
	return elements.concat(...elementsRest, array);
}
