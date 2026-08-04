import type * as DCommon from "@scripts/common";

export type LessThanOrEqualConstraintName = "number-greater-less-or-equal";

export interface LessThanOrEqual<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<LessThanOrEqualConstraintName, GenericNumber> {}

export type ExtractLessThanOrEqual<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends LessThanOrEqual<number>
	? (
		keyof GenericConstraint[DCommon.ConstraintSymbol][LessThanOrEqualConstraintName]
	) extends infer InferredResult extends number
		? LessThanOrEqual<InferredResult>
		: GenericDefault
	: GenericDefault;
