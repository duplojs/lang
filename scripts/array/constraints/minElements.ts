import type * as DCommon from "@scripts/common";

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
		? MinElements<InferredResult>
		: GenericDefault
	: GenericDefault;
