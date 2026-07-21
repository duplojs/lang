export function insert<
	GenericValue extends unknown,
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
): (
	value: GenericValue,
) => (
	| GenericArray[number]
	| GenericValue
)[];

export function insert<
	GenericValue extends unknown,
	GenericArray extends readonly unknown[],
>(
	value: GenericValue,
	array: GenericArray,
): (
	| GenericArray[number]
	| GenericValue
)[];

export function insert(
	...args:
		| [array: readonly unknown[]]
		| [value: unknown, array: readonly unknown[]]
) {
	if (args.length === 1) {
		const [array] = args;

		return (value: unknown) => insert(value, array);
	}

	const [value, array] = args;

	const result = array.slice();
	result.push(value);

	return result;
}
