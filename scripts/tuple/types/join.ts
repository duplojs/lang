import type * as DCommon from "@scripts/common";
import type { Shift } from "./shift";

export type Join<
	GenericArray extends DCommon.AnyTuple<string> | readonly [],
	GenericSeparator extends string,
	GenericDepth extends readonly unknown[] = [],
> = GenericArray extends DCommon.AnyTuple<string>
	? DCommon.IsEqual<GenericDepth["length"], 100> extends true
		? string
		: Shift<GenericArray> extends infer InferredRest extends readonly string[]
			? InferredRest extends DCommon.AnyTuple<string>
				? Join<
					InferredRest,
					GenericSeparator,
					[...GenericDepth, 0]
				> extends infer InferredRestResult extends string
					? `${GenericArray[0]}${GenericSeparator}${InferredRestResult}`
					: never
				: InferredRest extends readonly []
					? GenericArray[0]
					: `${GenericArray[0]}${GenericSeparator}${string}`
			: never
	: "";
