export function max<
	GenericArray extends readonly number[],
>(array: GenericArray) {
	// Use a loop if spread inputs can become large.
	return Math.max(...array);
}
