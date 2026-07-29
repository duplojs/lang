import type * as DArray from "@scripts/array";

export function max<
	GenericArray extends readonly number[],
>(
	array: GenericArray & DArray.RequireAtLeastElements<GenericArray, 1>,
) {
	// Use a loop if spread inputs can become large.
	return Math.max(...array);
}
