export function fillAll<
	GenericElement extends unknown,
>(
	element: GenericElement,
): (
	array: readonly unknown[],
) => GenericElement[];

export function fillAll<
	GenericElement extends unknown,
>(
	array: readonly unknown[],
	element: GenericElement,
): GenericElement[];

export function fillAll(
	...args:
		| [array: readonly unknown[], element: unknown]
		| [element: unknown]
) {
	if (args.length === 1) {
		const [value] = args;

		return (array: readonly unknown[]) => fillAll(array, value);
	}

	const [array, value] = args;

	return array.slice().fill(value);
}
