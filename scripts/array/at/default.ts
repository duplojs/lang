import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import type { MaxElements } from "../maxElements";
import type { MinElements } from "../minElements";
import type { LengthEqual } from "../lengthEqual";

type ComputeOutputFromMinElements<
	GenericArray extends readonly unknown[],
	GenericIndex extends number,
> = GenericArray extends MinElements<infer InferredMin>
	? DNumber.IsGreater<InferredMin, GenericIndex> extends true
		? GenericArray[GenericIndex]
		: GenericArray[number] | undefined
	: GenericArray[number] | undefined;

export type At<
	GenericArray extends readonly unknown[],
	GenericIndex extends number,
> = DCommon.IsEqual<GenericIndex, number> extends true
	? GenericArray[number] | undefined
	: GenericArray extends LengthEqual<infer InferredLength>
		? DNumber.IsGreaterOrEqual<GenericIndex, InferredLength> extends true
			? undefined
			: GenericArray[GenericIndex]
		: GenericArray extends MaxElements<infer InferredMax>
			? DNumber.IsGreaterOrEqual<GenericIndex, InferredMax> extends true
				? undefined
				: ComputeOutputFromMinElements<GenericArray, GenericIndex>
			: ComputeOutputFromMinElements<GenericArray, GenericIndex>;

export function at<
	GenericArray extends readonly unknown[],
	GenericIndex extends number,
>(
	index: GenericIndex,
): (
	array: GenericArray,
) => At<GenericArray, GenericIndex>;

export function at<
	GenericArray extends readonly unknown[],
	GenericIndex extends number,
>(
	array: GenericArray,
	index: GenericIndex,
): At<GenericArray, GenericIndex>;

export function at(
	...args:
		| [array: readonly unknown[], index: number]
		| [index: number]
) {
	if (args.length === 1) {
		const [index] = args;

		return (array: readonly unknown[]) => at(array, index);
	}

	const [input, index] = args;

	return input.at(index);
}
