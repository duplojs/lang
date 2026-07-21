import type * as DCommon from "@scripts/common";

export function shift<
	const GenericArray extends readonly unknown[],
>(
	array: GenericArray,
): DCommon.RemoveConstraint<GenericArray>;

export function shift(
	array: readonly unknown[],
) {
	return array.slice(1);
}
