import type * as DString from "@scripts/string";

export type IsLiteral<
	GenericNumber extends number,
> = DString.TemplateLiteralContainLargeType<`${GenericNumber}`>;
