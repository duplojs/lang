import type * as DArray from "@scripts/array";
import type * as DCommon from "@scripts/common";

export function min<
	GenericArray extends DCommon.AnyTuple<number> | readonly number[] & DArray.MinElements<1>,
>(array: GenericArray) {
	// Use a loop if spread inputs can become large.
	return Math.min(...array);
}
