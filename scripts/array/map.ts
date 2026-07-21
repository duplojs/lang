import type * as DCommon from "@scripts/common";
import type { ReapplyConstraints } from "./types";

export interface MapTheFunctionParams<
	GenericInputArray extends readonly unknown[],
> {
	index: number;
	self: GenericInputArray;
}

export function map<
	GenericArray extends readonly unknown[],
	GenericOutput extends unknown,
>(
	theFunction: (
		element: GenericArray[number],
		params: MapTheFunctionParams<GenericArray>,
	) => GenericOutput,
): (
	array: GenericArray,
) => ReapplyConstraints<GenericArray, GenericOutput[]>;

export function map<
	GenericArray extends readonly unknown[],
	GenericOutput extends unknown,
>(
	array: GenericArray,
	theFunction: (
		element: GenericArray[number],
		params: MapTheFunctionParams<GenericArray>,
	) => GenericOutput,
): ReapplyConstraints<GenericArray, GenericOutput[]>;

export function map(
	...args:
		| [theFunction: DCommon.AnyFunction]
		| [array: readonly unknown[], theFunction: DCommon.AnyFunction]
) {
	if (args.length === 1) {
		const [theFunction] = args;

		return (array: readonly unknown[]) => map(array, theFunction);
	}

	const [array, theFunction] = args;

	return array.map(
		(element, index) => theFunction(
			element,
			{
				index,
				self: array,
			},
		),
	);
}
