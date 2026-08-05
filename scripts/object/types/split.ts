import type * as DCommon from "@scripts/common";

export type Split<
	GenericValue extends unknown,
	GenericMax extends number = never,
	GenericAccumulator extends readonly never[] = readonly [],
> = GenericValue extends object
	? GenericAccumulator["length"] extends GenericMax
		? GenericValue
		: {
			[Prop in keyof GenericValue]: DCommon.NeverCoalescing<
				Split<
					GenericValue[Prop],
					GenericMax,
					[...GenericAccumulator, never]
				> extends infer InferredResult
					? InferredResult extends any
						? { [RemapProp in Prop]: InferredResult }
						: never
					: never,
				{ [RemapProp in Prop]: never }
			>
		}[keyof GenericValue]
	: GenericValue;
