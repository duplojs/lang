import type * as DCommon from "@scripts/common";

export interface MaxCharacters<
	GenericMax extends number,
> extends DCommon.DynamicConstraint<"string-max-characters", GenericMax> {}
