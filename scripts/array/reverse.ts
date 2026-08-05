import type { ReapplyAllSizeConstraints } from "./constraints";

type ReverseOutput<
	GenericArray extends readonly unknown[],
> = ReapplyAllSizeConstraints<GenericArray, GenericArray[number][]>;

export function reverse<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
): ReverseOutput<GenericArray>;

export function reverse<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
) {
	return array.slice().reverse();
}
