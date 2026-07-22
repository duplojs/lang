import type { ReapplyAllConstraints } from "../constraints";

type SpliceDeleteOutput<
	GenericArray extends readonly unknown[],
> = ReapplyAllConstraints<
	GenericArray,
	GenericArray[number][],
	"lengthEqual" | "minElements"
>;

export function spliceDelete(
	indexTo: number,
	deleteCount: number,
): <GenericArray extends readonly unknown[]>(
	array: GenericArray,
) => SpliceDeleteOutput<GenericArray>;

export function spliceDelete<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	indexTo: number,
	deleteCount: number,
): SpliceDeleteOutput<GenericArray>;

export function spliceDelete(
	...args:
		| [indexTo: number, deleteCount: number]
		| [array: readonly unknown[], indexTo: number, deleteCount: number]
) {
	if (args.length === 2) {
		const [indexTo, deleteCount] = args;

		return (array: readonly unknown[]) => spliceDelete(array, indexTo, deleteCount);
	}

	const [array, indexTo, deleteCount] = args;

	const result = array.slice();
	result.splice(indexTo, deleteCount);

	return result;
}
