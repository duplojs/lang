import type * as DCommon from "@scripts/common";

export interface GreaterThan<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<"number-greater-than", GenericNumber> {}
