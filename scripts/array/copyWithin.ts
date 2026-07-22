import type { ReapplyAllConstraints } from "./constraints";

type CopyWithinOutput<
	GenericArray extends readonly unknown[],
> = ReapplyAllConstraints<GenericArray, GenericArray[number][]>;

export function copyWithin<
	GenericArray extends readonly unknown[],
>(
	target: number,
	start: number,
	end?: number,
): (
	array: GenericArray,
) => CopyWithinOutput<GenericArray>;

export function copyWithin<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	target: number,
	start: number,
	end?: number,
): CopyWithinOutput<GenericArray>;

export function copyWithin(
	...args:
		| [target: number, start: number, end?: number]
		| [array: readonly unknown[], target: number, start: number, end?: number]
) {
	if (!Array.isArray(args[0])) {
		const [target, start, end] = args as [number, number, number?];

		return (array: readonly unknown[]) => copyWithin(array, target, start, end);
	}

	const [array, target, start, end] = args as [unknown[], number, number, number?];

	return array.slice().copyWithin(target, start, end);
}
