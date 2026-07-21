export function push<
	GenericValue extends unknown,
>(
	value: NoInfer<GenericValue>,
): (
	array: readonly GenericValue[],
) => GenericValue[];

export function push<
	GenericValue extends unknown,
>(
	array: readonly GenericValue[],
	value: NoInfer<GenericValue>,
	...valuesRest: readonly NoInfer<GenericValue>[]
): GenericValue[];

export function push(
	...args:
		| [value: unknown]
		| [array: readonly unknown[], value: unknown, ...valuesRest: readonly unknown[]]
) {
	if (args.length === 1) {
		const [value] = args;

		return (array: readonly unknown[]) => push(array, value);
	}

	const [array, ...values] = args as [unknown[], ...unknown[]];

	return [...array, ...values];
}
