import type { ReapplyAllConstraints } from "./constraints";

type PopOutput<
	GenericArray extends readonly unknown[],
> = ReapplyAllConstraints<
	GenericArray,
	GenericArray[number][],
	"lengthEqual" | "minElements"
>;

export function pop<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
): PopOutput<GenericArray>;

export function pop(array: readonly unknown[]) {
	return array.slice(0, -1);
}
