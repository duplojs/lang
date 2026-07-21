export function unshift<
	GenericArray extends readonly unknown[],
	GenericValue extends unknown,
>(
	value: GenericValue,
): (
	array: GenericArray,
) => (
	| GenericValue
	| GenericArray[number]
);

export function unshift<
	GenericArray extends readonly unknown[],
	GenericValue extends unknown,
	GenericValuesRest extends readonly unknown[],
>(
	array: GenericArray,
	value: GenericValue,
	...valuesRest: GenericValuesRest
): (
	| GenericValue
	| GenericValuesRest[number]
	| GenericArray[number]
)[];

export function unshift(
	...args:
		| [value: unknown]
		| [array: readonly unknown[], value: unknown, ...valuesRest: readonly unknown[]]
) {
	if (args.length === 1) {
		const [value] = args as [unknown];

		return (array: readonly unknown[]) => unshift(array, value);
	}

	const [array, ...values] = args as [unknown[], unknown, ...unknown[]];

	// Use a loop if spread inputs can become large.
	return [...values, ...array];
}
