import type * as DCommon from "@scripts/common";

export interface MinElements<
	GenericMin extends number,
> extends DCommon.DynamicConstraint<"array-min-elements", GenericMin> {}
