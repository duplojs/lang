import type * as DCommon from "@scripts/common";
import type * as DTuple from "@scripts/tuple";

export type MinElementsConstraintName = "array-min-elements";

export interface MinElements<
	GenericMin extends number,
> extends DCommon.DynamicConstraint<MinElementsConstraintName, GenericMin> {}

export type ExtractMinElements<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends MinElements<number>
	? (
		keyof GenericConstraint[DCommon.ConstraintSymbol][MinElementsConstraintName]
	) extends infer InferredResult extends number
		? DCommon.UnionToIntersection<
			| (
				InferredResult extends any
					? MinElements<InferredResult>
					: never
			)
			| (
				GenericConstraint extends DCommon.AnyTuple
					? MinElements<DTuple.CountMinElement<GenericConstraint>>
					: never
			)
		>
		: GenericDefault
	: GenericConstraint extends DCommon.AnyTuple
		? MinElements<DTuple.CountMinElement<GenericConstraint>>
		: GenericDefault;
