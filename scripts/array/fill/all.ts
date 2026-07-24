import type { ReapplyAllSizeConstraints } from "../constraints";

type FillAllOutput<
	GenericArray extends readonly unknown[],
	GenericElement extends unknown,
> = ReapplyAllSizeConstraints<GenericArray, GenericElement[]>;

export function fillAll<
	GenericElement extends unknown,
>(
	element: GenericElement,
): <GenericArray extends readonly unknown[]>(
	array: GenericArray,
) => FillAllOutput<GenericArray, GenericElement>;

export function fillAll<
	GenericElement extends unknown,
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	element: GenericElement,
): FillAllOutput<GenericArray, GenericElement>;

export function fillAll(
	...args:
		| [array: readonly unknown[], element: unknown]
		| [element: unknown]
) {
	if (args.length === 1) {
		const [value] = args;

		return (array: readonly unknown[]) => fillAll(array, value);
	}

	const [array, value] = args;

	return array.slice().fill(value);
}
