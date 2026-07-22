import type { ReapplyAllConstraints } from "./constraints";

type ShiftOutput<
	GenericArray extends readonly unknown[],
> = ReapplyAllConstraints<
	GenericArray,
	GenericArray[number][],
	"lengthEqual" | "minElements"
>;

export function shift<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
): ShiftOutput<GenericArray>;

export function shift(
	array: readonly unknown[],
) {
	return array.slice(1);
}
