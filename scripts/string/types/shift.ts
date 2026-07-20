import type * as DCommon from "@scripts/common";
import type { TemplateLiteralContainLargeType } from "./templateLiteralContainLargeType";

export type Shift<
	GenericValue extends string,
> = TemplateLiteralContainLargeType<GenericValue> extends true
	? string
	: DCommon.IsEqual<GenericValue, ""> extends true
		? ""
		: GenericValue extends `${infer _InferredFirst}${infer InferredRest}`
			? InferredRest
			: string;
