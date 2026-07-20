import type * as DCommon from "@scripts/common";
import type { LengthEqual } from "./lengthEqual";
import type { MaxElements } from "./maxElements";

export interface FilterPredicateFunctionParams<
	GenericArray extends readonly unknown[] = readonly unknown[],
> {
	index: number;
	self: GenericArray;
}

type ComputeOutput<
	GenericArray extends readonly unknown[],
	GenericOutput extends GenericArray[number] = GenericArray[number],
> = GenericArray extends MaxElements<infer InferredMax>
	? GenericOutput[] & MaxElements<InferredMax>
	: GenericArray extends LengthEqual<infer InferredLength>
		? GenericOutput[] & MaxElements<InferredLength>
		: GenericOutput[];

export function filter<
	GenericArray extends readonly unknown[],
	GenericOutput extends GenericArray[number],
>(
	predicate: (
		element: GenericArray[number],
		params: FilterPredicateFunctionParams<GenericArray>,
	) => element is GenericOutput,
): (
	array: GenericArray,
) => ComputeOutput<GenericArray, GenericOutput>;

export function filter<
	GenericArray extends readonly unknown[],
	GenericOutput extends GenericArray[number],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FilterPredicateFunctionParams<GenericArray>,
	) => element is GenericOutput,
): ComputeOutput<GenericArray, GenericOutput>;

export function filter<
	GenericArray extends readonly unknown[],
>(
	predicate: (
		element: GenericArray[number],
		params: FilterPredicateFunctionParams<GenericArray>,
	) => boolean,
): (
	array: GenericArray,
) => ComputeOutput<GenericArray>;

export function filter<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FilterPredicateFunctionParams<GenericArray>,
	) => boolean,
): ComputeOutput<GenericArray>;

export function filter(
	...args:
		| [predicate: DCommon.AnyFunction]
		| [array: readonly unknown[], predicate: DCommon.AnyFunction]
) {
	if (args.length === 1) {
		const [predicate] = args;

		return (array: readonly unknown[]) => filter(array, predicate);
	}

	const [array, predicate] = args;

	return array.filter(
		(element, index) => predicate(
			element,
			{
				index,
				self: array,
			},
		),
	);
}
