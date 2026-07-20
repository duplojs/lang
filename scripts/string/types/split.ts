import type * as DCommon from "@scripts/common";
import type * as DTuple from "@scripts/tuple";
import type { Includes } from "./includes";
import type { TemplateLiteralContainLargeType } from "./templateLiteralContainLargeType";

type _Split<
	GenericString extends string,
	GenericSeparator extends string,
	GenericLimit extends number = number,
	GenericLastResult extends string[] = [],
> = GenericString extends `${infer InferredBefore}${GenericSeparator}${infer InferredAfter}`
	? [...GenericLastResult, InferredBefore] extends infer InferredResult extends any[]
		? DCommon.IsEqual<InferredAfter, ""> extends true
			? InferredResult
			: DCommon.IsEqual<InferredResult["length"], 250> extends true
				? Includes<InferredAfter, GenericSeparator> extends true
					? [...InferredResult, ...string[]]
					: InferredResult
				: DCommon.IsEqual<InferredResult["length"], GenericLimit> extends true
					? InferredResult
					: _Split<
						InferredAfter,
						GenericSeparator,
						GenericLimit,
						InferredResult
					>
		: never
	: [...GenericLastResult, GenericString];

export type Split<
	GenericString extends string,
	GenericSeparator extends string,
	GenericLimit extends number = number,
> = DCommon.IsEqual<GenericLimit, 0> extends true
	? []
	: TemplateLiteralContainLargeType<GenericSeparator> extends true
		? [string, ...string[]]
		: TemplateLiteralContainLargeType<GenericString> extends true
			? [
				...DTuple.Create<
					string,
					_Split<
						GenericString,
						GenericSeparator,
						GenericLimit
					>["length"]
				>,
				...string[],
			]
			: _Split<
				GenericString,
				GenericSeparator,
				GenericLimit
			>;
