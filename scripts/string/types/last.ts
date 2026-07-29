import type * as DCommon from "@scripts/common";

export type Last<
	GenericValue extends string,
> = DCommon.IsEqual<GenericValue, ""> extends true
	? undefined
	: GenericValue extends `${string}${infer InferredLeft}${infer InferredRight}`
		? DCommon.IsEqual<InferredRight, ""> extends true
			? InferredLeft
			: Last<`${InferredLeft}${InferredRight}`>
		: string | undefined;
