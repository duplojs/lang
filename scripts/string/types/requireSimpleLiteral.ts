import type * as DCommon from "@scripts/common";

export type RequireSimpleLiteral<
	GenericString extends string,
> = GenericString extends DCommon.BaseConstraint
	? DCommon.ComputedTypeError<"Constrained strings are not allowed.">
	: DCommon.IsEqual<GenericString, string> extends true
		? DCommon.ComputedTypeError<"Must be a literal string, not the generic 'string'">
		: unknown;
