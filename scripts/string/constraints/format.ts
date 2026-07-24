import type * as DCommon from "@scripts/common";

export interface Format<
	GenericName extends string,
	GenericFormat extends string = string,
> {
	[DCommon.ConstraintKind]: {
		"string-format": Record<GenericName, GenericFormat>;
	};
}
