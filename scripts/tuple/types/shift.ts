import type * as DCommon from "@scripts/common";

export type Shift<
	GenericArray extends DCommon.AnyTuple,
> = GenericArray extends readonly [any, ...infer InferredRest]
	? InferredRest
	: never;
