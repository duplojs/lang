export function betweenThan<
	GenericValue extends number,
>(
	greater: number,
	less: number,
): (
	value: GenericValue,
) => boolean;

export function betweenThan<
	GenericValue extends number,
>(
	value: GenericValue,
	greater: number,
	less: number,
): boolean;

export function betweenThan(
	...args:
		| [greater: number, less: number]
		| [value: number, greater: number, less: number]
) {
	if (args.length === 2) {
		const [greater, less] = args;
		return (value: number) => betweenThan(value, greater, less);
	}

	const [value, greater, less] = args;

	return value > greater && value < less;
}
