import type * as DCommon from "@scripts/common";

export interface LengthEqual<
	GenericLength extends number,
> extends DCommon.DynamicConstraint<"string-length-equal", GenericLength> {}
