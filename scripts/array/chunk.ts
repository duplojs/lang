export function chunk<
	GenericArray extends readonly unknown[],
>(
	size: number,
): (
	array: GenericArray,
) => GenericArray[];

export function chunk<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	size: number,
): GenericArray[];

export function chunk(
	...args:
		| [size: number]
		| [array: readonly unknown[], size: number]
) {
	if (args.length === 1) {
		const [size] = args;

		return (array: readonly unknown[]) => chunk(array, size);
	}

	const [array, size] = args;

	const result = [];

	for (let index = 0; index < array.length; index += size) {
		result.push(array.slice(index, index + size));
	}

	return result;
}
