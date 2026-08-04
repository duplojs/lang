import type * as DCommon from "@scripts/common";

export type LengthEqualConstraintName = "string-length-equal";

export interface LengthEqual<
	GenericLength extends number,
> extends DCommon.DynamicConstraint<LengthEqualConstraintName, GenericLength> {}

export type ExtractLengthEqual<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends LengthEqual<number>
	? (
		keyof GenericConstraint[DCommon.ConstraintSymbol][LengthEqualConstraintName]
	) extends infer InferredResult extends number
		? LengthEqual<InferredResult>
		: GenericDefault
	: GenericDefault;
