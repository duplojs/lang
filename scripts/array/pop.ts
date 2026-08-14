import type { ReapplyCompatiblesConstraints } from "./constraints";

type PopOutput<
	GenericArray extends readonly unknown[],
> = ReapplyCompatiblesConstraints<
	GenericArray,
	readonly GenericArray[number][],
	"maxElements"
>;

export function pop<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
): PopOutput<GenericArray>;

export function pop(array: readonly unknown[]): any {
	return array.slice(0, -1);
}
