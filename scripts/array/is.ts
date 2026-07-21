export function is<
	GenericValue extends unknown,
>(
	value: GenericValue,
): value is Extract<GenericValue, readonly any[]> {
	return value instanceof Array;
}
