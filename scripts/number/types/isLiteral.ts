import type * as DCommon from "@scripts/common";

export type IsLiteral<
	GenericNumber extends number,
> = DCommon.Not<DCommon.IsEqual<DCommon.RemoveConstraint<GenericNumber>, number>>;
