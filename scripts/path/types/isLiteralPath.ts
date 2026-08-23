import type * as DCommon from "@scripts/common";
import type * as DString from "@scripts/string";

type CheckSegment<
	GenericSegment extends readonly string[],
> = GenericSegment extends readonly []
	? true
	: GenericSegment extends readonly [
		infer InferredFirst extends string,
		...infer InferredRest extends readonly string[],
	]
		? DCommon.Or<[
			DCommon.IsEqual<"", InferredFirst>,
			DString.Includes<InferredFirst, "/">,
			DString.Includes<InferredFirst, "\0">,
		]> extends true
			? false
			: CheckSegment<InferredRest>
		: never;

export type IsLiteralPath<
	GenericValue extends string,
> = DString.IsLiteral<GenericValue> extends true
	? DString.Split<
		(
			GenericValue extends `/${infer InferredRest}`
				? InferredRest
				: GenericValue
		),
		"/"
	> extends infer InferredResult extends readonly string[]
		? CheckSegment<InferredResult>
		: never
	: false;

type yy = IsLiteralPath<"/tset/gg">;
