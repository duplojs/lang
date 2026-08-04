import type * as DCommon from "@scripts/common";

export type GreaterThanOrEqualConstraintName = "number-greater-than-or-equal";

export interface GreaterThanOrEqual<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<GreaterThanOrEqualConstraintName, GenericNumber> {}

export type ExtractGreaterThanOrEqual<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends GreaterThanOrEqual<number>
	? (
		keyof GenericConstraint[DCommon.ConstraintSymbol][GreaterThanOrEqualConstraintName]
	) extends infer InferredResult extends number
		? GreaterThanOrEqual<InferredResult>
		: GenericDefault
	: GenericDefault;
