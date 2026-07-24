import type * as DCommon from "@scripts/common";

export interface GreaterThanOrEqual<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<"number-greater-than-or-equal", GenericNumber> {}
