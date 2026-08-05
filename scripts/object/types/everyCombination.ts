import type * as DCommon from "@scripts/common";

type CreateEveryCombinationOnKey<
	GenericObject extends object,
	GenericMainKey extends keyof GenericObject,
	GenericOtherKeys extends Exclude<keyof GenericObject, GenericMainKey>,
	GenericAccumulator extends object,
> = DCommon.IsNever<GenericOtherKeys> extends true
	? GenericAccumulator
	: DCommon.LastUnionElement<GenericOtherKeys> extends infer InferredLastKey extends keyof GenericObject
		? CreateEveryCombinationOnKey<
			GenericObject,
			GenericMainKey,
			Exclude<GenericOtherKeys, InferredLastKey>,
			(
				{ [Remap in InferredLastKey]: GenericObject[InferredLastKey] }
			) extends infer InferredResult extends object
				? (
					| GenericAccumulator
					| (
						& InferredResult
						& GenericAccumulator
					)
				)
				: never
		>
		: never;

type LoopOnEveryKeys<
	GenericObject extends object,
	GenericKeys extends keyof GenericObject,
	GenericAccumulator extends object = never,
> = DCommon.IsNever<GenericKeys> extends true
	? GenericAccumulator
	: DCommon.LastUnionElement<GenericKeys> extends infer InferredLastKey extends keyof GenericObject
		? LoopOnEveryKeys<
			GenericObject,
			Exclude<GenericKeys, InferredLastKey>,
			| GenericAccumulator
			| (
				CreateEveryCombinationOnKey<
					GenericObject,
					InferredLastKey,
					Exclude<keyof GenericObject, InferredLastKey>,
					{ [Remap in InferredLastKey]: GenericObject[InferredLastKey] }
				> extends infer InferredResult extends object
					? InferredResult extends any
						? {
							[Prop in keyof InferredResult]: EveryCombination<
								InferredResult[Prop]
							> extends infer InferredSubResult
								? InferredSubResult extends any
									? (
										& Omit<InferredResult, Prop>
										& { [Remap in Prop]: InferredSubResult }
									)
									: never
								: never
						}[keyof InferredResult]
						: never
					: never
		)
		>
		: never;

export type EveryCombination<
	GenericValue extends unknown,
> = GenericValue extends object
	? DCommon.SimplifyTypeForce<
		DCommon.RemoveDuplicateInUnion<
			LoopOnEveryKeys<
				GenericValue,
				keyof GenericValue
			>
		>
	>
	: GenericValue;
