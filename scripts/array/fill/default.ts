export function fill<
	GenericElement extends unknown,
>(
	value: GenericElement,
	start: number,
	end: number,
): (
	array: readonly GenericElement[],
) => GenericElement[];

export function fill<
	GenericElement extends unknown,
>(
	array: readonly GenericElement[],
	value: GenericElement,
	start: number,
	end: number,
): GenericElement[];

export function fill(
	...args:
		| [array: readonly unknown[], value: unknown, start: number, end: number]
		| [value: unknown, start: number, end: number]
) {
	if (args.length === 3) {
		const [value, start, end] = args;

		return (array: readonly unknown[]) => fill(array, value, start, end);
	}

	const [array, value, start, end] = args;

	return array.slice().fill(value, start, end);
}
