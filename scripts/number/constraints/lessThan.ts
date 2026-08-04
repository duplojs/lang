import type * as DCommon from "@scripts/common";

export type LessThanConstraintName = "number-greater-less";

export interface LessThan<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<LessThanConstraintName, GenericNumber> {}

export type ExtractLessThan<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends LessThan<number>
	? (
		keyof GenericConstraint[DCommon.ConstraintSymbol][LessThanConstraintName]
	) extends infer InferredResult extends number
		? LessThan<InferredResult>
		: GenericDefault
	: GenericDefault;
