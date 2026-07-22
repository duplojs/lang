export function greaterThanOrEqual<
	GenericValue extends number,
>(
	threshold: number,
): (
	value: GenericValue,
) => boolean;

export function greaterThanOrEqual<
	GenericValue extends number,
>(
	value: GenericValue,
	threshold: number,
): boolean;

export function greaterThanOrEqual(
	...args:
		| [threshold: number]
		| [value: number, threshold: number]
) {
	if (args.length === 1) {
		const [threshold] = args;

		return (value: number) => greaterThanOrEqual(value, threshold);
	}

	const [value, threshold] = args;

	return value >= threshold;
}
