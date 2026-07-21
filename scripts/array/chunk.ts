import type * as DCommon from "@scripts/common";

export function chunk<
	GenericArray extends readonly unknown[],
>(
	size: number,
): (
	array: GenericArray,
) => DCommon.RemoveConstraint<GenericArray[number]>[][];

export function chunk<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	size: number,
): DCommon.RemoveConstraint<GenericArray[number]>[][];

export function chunk(
	...args:
		| [size: number]
		| [array: readonly unknown[], size: number]
) {
	if (args.length === 1) {
		const [size] = args;

		return (array: readonly unknown[]) => chunk(array, size);
	}

	const [array, size] = args;

	const result = [];

	for (let index = 0; index < array.length; index += size) {
		result.push(array.slice(index, index + size));
	}

	return result;
}
