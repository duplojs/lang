import type * as DCommon from "@scripts/common";

export function pop<
	const GenericArray extends readonly unknown[],
>(
	array: GenericArray,
): DCommon.RemoveConstraint<GenericArray>;

export function pop(array: readonly unknown[]) {
	return array.slice(0, -1);
}
