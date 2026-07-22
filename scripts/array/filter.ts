import type * as DCommon from "@scripts/common";
import type { ReapplyAllConstraints } from "./constraints";

export interface FilterPredicateFunctionParams<
	GenericArray extends readonly unknown[] = readonly unknown[],
> {
	index: number;
	self: GenericArray;
}

type FilterOutput<
	GenericArray extends readonly unknown[],
	GenericElement extends GenericArray[number] = GenericArray[number],
> = ReapplyAllConstraints<
	GenericArray,
	GenericElement[],
	"lengthEqual" | "minElements"
>;

export function filter<
	GenericArray extends readonly unknown[],
	GenericElement extends GenericArray[number],
>(
	predicate: (
		element: GenericArray[number],
		params: FilterPredicateFunctionParams<GenericArray>,
	) => element is GenericElement,
): (
	array: GenericArray,
) => FilterOutput<GenericArray, GenericElement>;

export function filter<
	GenericArray extends readonly unknown[],
	GenericElement extends GenericArray[number],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FilterPredicateFunctionParams<GenericArray>,
	) => element is GenericElement,
): FilterOutput<GenericArray, GenericElement>;

export function filter<
	GenericArray extends readonly unknown[],
>(
	predicate: (
		element: GenericArray[number],
		params: FilterPredicateFunctionParams<GenericArray>,
	) => boolean,
): (
	array: GenericArray,
) => FilterOutput<GenericArray>;

export function filter<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FilterPredicateFunctionParams<GenericArray>,
	) => boolean,
): FilterOutput<GenericArray>;

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
