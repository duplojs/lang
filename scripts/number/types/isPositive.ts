import type * as DCommon from "@scripts/common";
import type * as DString from "@scripts/string";

export type IsPositive<
	GenericValue extends number,
> = DCommon.Not<DString.Includes<`${GenericValue}`, "-">>;

