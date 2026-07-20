export function concat<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
>(
	elements: GenericElements,
): (
	array: GenericArray,
) => (
	| GenericArray[number]
	| GenericElements[number]
)[];

export function concat<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
	GenericElementsRest extends readonly unknown[][],
>(
	array: GenericArray,
	elements: GenericElements,
	...elementsRest: GenericElementsRest
): (
	| GenericArray[number]
	| GenericElements[number]
	| GenericElementsRest[number][number]
)[];

export function concat(
	...args:
		| [elements: readonly unknown[]]
		| [array: readonly unknown[], elements: readonly unknown[], ...elementsRest: readonly unknown[]]
) {
	if (args.length === 1) {
		const [elements] = args;

		return (array: readonly unknown[]) => concat(array, elements);
	}

	const [array, elements, ...elementsRest] = args;

	return array.concat(elements, ...elementsRest);
}
