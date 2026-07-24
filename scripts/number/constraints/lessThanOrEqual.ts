import type * as DCommon from "@scripts/common";

export interface LessThanOrEqual<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<"number-greater-less-or-equal", GenericNumber> {}
