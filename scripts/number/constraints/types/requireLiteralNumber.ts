import type * as DCommon from "@scripts/common";
import type * as DString from "@scripts/string";

export type RequireLiteralNumber<
	GenericNumber extends number,
> = DString.TemplateLiteralContainLargeType<`${GenericNumber}`> extends true
	? DCommon.ComputedTypeError<"Must be a literal number, not the generic 'number'">
	: unknown;
