import type * as DCommon from "@scripts/common";

export interface LessThan<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<"number-greater-less", GenericNumber> {}
