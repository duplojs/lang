import type * as DCommon from "@scripts/common";

export interface MinCharacters<
	GenericMin extends number,
> extends DCommon.DynamicConstraint<"string-min-characters", GenericMin> {}
