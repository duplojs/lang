import type * as DCommon from "@scripts/common";

export type MaxElementsConstraintName = "array-max-elements";

export interface MaxElements<
	GenericMax extends number,
> extends DCommon.DynamicConstraint<MaxElementsConstraintName, GenericMax> {}

export type ExtractMaxElements<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends MaxElements<number>
	? (
		keyof GenericConstraint[DCommon.ConstraintSymbol][MaxElementsConstraintName]
	) extends infer InferredResult extends number
		? DCommon.UnionToIntersection<
			InferredResult extends any
				? MaxElements<InferredResult>
				: never
		>
		: GenericDefault
	: GenericDefault;
