export function includes<
	GenericArray extends readonly unknown[],
	GenericArrayValue extends GenericArray[number],
>(
	value: GenericArrayValue,
): (
	array: GenericArray,
) => boolean;

export function includes<
	GenericArray extends readonly unknown[],
	GenericArrayValue extends GenericArray[number],
>(
	array: GenericArray,
	value: GenericArrayValue,
): boolean;

export function includes(
	...args:
		| [value: unknown]
		| [array: readonly unknown[], value: unknown]
) {
	if (args.length === 1) {
		const [value] = args;

		return (array: readonly unknown[]) => includes(array, value);
	}

	const [array, value] = args;

	return array.includes(value);
}
