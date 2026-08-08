import type * as DCommon from "@scripts/common";

export type CountMinElement<
	GenericTuple extends DCommon.AnyTuple,
	GenericAccumulator extends readonly never[] = [],
> = number extends GenericTuple["length"]
	? GenericTuple extends readonly [infer __, ...infer InferredRest]
		? InferredRest extends DCommon.AnyTuple
			? CountMinElement<
				InferredRest,
				[...GenericAccumulator, never]
			>
			: [...GenericAccumulator, never]["length"]
		: never
	: GenericTuple["length"];
