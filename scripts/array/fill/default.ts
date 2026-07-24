import type { ReapplyAllSizeConstraints } from "../constraints";

type FillOutput<
	GenericArray extends readonly unknown[],
	GenericValue extends unknown,
> = ReapplyAllSizeConstraints<
	GenericArray,
	(
		| GenericArray[number]
		| GenericValue
	)[]
>;

export function fill<
	GenericArray extends readonly unknown[],
	GenericValue extends unknown,
>(
	value: GenericValue,
	start: number,
	end: number,
): (
	array: GenericArray,
) => FillOutput<GenericArray, GenericValue>;

export function fill<
	GenericArray extends readonly unknown[],
	GenericValue extends unknown,
>(
	array: GenericArray,
	value: GenericValue,
	start: number,
	end: number,
): FillOutput<GenericArray, GenericValue>;

export function fill(
	...args:
		| [array: readonly unknown[], value: unknown, start: number, end: number]
		| [value: unknown, start: number, end: number]
) {
	if (args.length === 3) {
		const [value, start, end] = args;

		return (array: readonly unknown[]) => fill(array, value, start, end);
	}

	const [array, value, start, end] = args;

	return array.slice().fill(value, start, end);
}
