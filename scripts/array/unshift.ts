import type { ReapplyAllSizeConstraints } from "./constraints";

type UnshiftOutput<
	GenericArray extends readonly unknown[],
	GenericValue extends unknown,
	GenericValuesRest extends readonly unknown[] = [],
> = ReapplyAllSizeConstraints<
	GenericArray,
	(
		| GenericValue
		| GenericValuesRest[number]
		| GenericArray[number]
	)[],
	"lengthEqual" | "maxElements"
>;

export function unshift<
	GenericArray extends readonly unknown[],
	GenericValue extends unknown,
>(
	value: GenericValue,
): (
	array: GenericArray,
) => UnshiftOutput<GenericArray, GenericValue>;

export function unshift<
	GenericArray extends readonly unknown[],
	GenericValue extends unknown,
	GenericValuesRest extends readonly unknown[],
>(
	array: GenericArray,
	value: GenericValue,
	...valuesRest: GenericValuesRest
): UnshiftOutput<GenericArray, GenericValue, GenericValuesRest>;

export function unshift(
	...args:
		| [value: unknown]
		| [array: readonly unknown[], value: unknown, ...valuesRest: readonly unknown[]]
) {
	if (args.length === 1) {
		const [value] = args as [unknown];

		return (array: readonly unknown[]) => unshift(array, value);
	}

	const [array, ...values] = args as [unknown[], unknown, ...unknown[]];

	// Use a loop if spread inputs can become large.
	return [...values, ...array];
}
