import type * as DArray from "@scripts/array";

export function min<
	GenericArray extends readonly number[] & DArray.MinElements<number>,
>(array: GenericArray) {
	// Use a loop if spread inputs can become large.
	return Math.min(...array);
}
