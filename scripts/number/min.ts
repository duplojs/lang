export function min<
	GenericArray extends readonly number[],
>(array: GenericArray) {
	// Use a loop if spread inputs can become large.
	return Math.min(...array);
}
