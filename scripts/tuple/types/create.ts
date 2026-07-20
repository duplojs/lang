import type * as DCommon from "@scripts/common";

export type Create<
	GenericValue extends unknown,
	GenericLength extends number,
	GenericLastTuple extends readonly unknown[] = [],
> = DCommon.IsEqual<GenericLength, number> extends true
	? GenericValue[]
	: DCommon.IsEqual<GenericLength, 0> extends true
		? []
		: [...GenericLastTuple, GenericValue] extends infer InferredResult extends any[]
			? DCommon.IsEqual<InferredResult["length"], GenericLength> extends true
				? InferredResult
				: DCommon.IsEqual<InferredResult["length"], 1000> extends true
					? [...InferredResult, ...GenericValue[]]
					: Create<
						GenericValue,
						GenericLength,
						InferredResult
					>
			: never;
