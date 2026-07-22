import type * as DCommon from "@scripts/common";

export interface MaxElements<
	GenericMax extends number,
> extends DCommon.DynamicConstraint<"array-max-elements", GenericMax> {}
