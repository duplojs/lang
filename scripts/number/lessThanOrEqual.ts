export function lessThanOrEqual<
	GenericValue extends number,
>(
	threshold: number,
): (
	value: GenericValue,
) => boolean;

export function lessThanOrEqual<
	GenericValue extends number,
>(
	value: GenericValue,
	threshold: number,
): boolean;

export function lessThanOrEqual(
	...args:
		| [threshold: number]
		| [value: number, threshold: number]
) {
	if (args.length === 1) {
		const [threshold] = args;

		return (value: number) => lessThanOrEqual(value, threshold);
	}

	const [value, threshold] = args;

	return value <= threshold;
}
