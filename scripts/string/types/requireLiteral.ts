import type * as DCommon from "@scripts/common";
import { type IsLiteral } from "./isLiteral";

export type RequireLiteral<
	GenericString extends string,
> = IsLiteral<GenericString> extends true
	? unknown
	: DCommon.ComputedTypeError<"Must be a literal string, not the generic 'string'">;
