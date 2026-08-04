import type * as DCommon from "@scripts/common";

export type GreaterThanConstraintName = "number-greater-than";

export interface GreaterThan<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<GreaterThanConstraintName, GenericNumber> {}

export type ExtractGreaterThan<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends GreaterThan<number>
	? (
		keyof GenericConstraint[DCommon.ConstraintSymbol][GreaterThanConstraintName]
	) extends infer InferredResult extends number
		? GreaterThan<InferredResult>
		: GenericDefault
	: GenericDefault;
