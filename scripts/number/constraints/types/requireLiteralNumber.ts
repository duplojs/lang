import type * as DCommon from "@scripts/common";

export type RequireLiteralNumber<
	GenericNumber extends number,
> = DCommon.IsEqual<DCommon.RemoveConstraint<GenericNumber>, number> extends true
	? DCommon.ComputedTypeError<"Must be a literal number, not the generic 'number'">
	: unknown;
