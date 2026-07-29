import type * as DCommon from "@scripts/common";

export type First<
	GenericValue extends string,
> = DCommon.IsEqual<GenericValue, ""> extends true
	? undefined
	: GenericValue extends `${infer InferredFirst}${string}`
		? InferredFirst
		: string | undefined;
