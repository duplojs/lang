import type * as DCommon from "@scripts/common";

export interface MultipleOf<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<"number-multiple-of", GenericNumber> {}
