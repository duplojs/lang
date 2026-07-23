import type * as DArray from "@scripts/array";

export function max<
	GenericArray extends readonly number[] & DArray.MinElements<number>,
>(array: GenericArray) {
	// Use a loop if spread inputs can become large.
	return Math.max(...array);
}
