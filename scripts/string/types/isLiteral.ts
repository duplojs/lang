import type * as DCommon from "@scripts/common";

export type IsLiteral<
	GenericString extends string,
> = DCommon.Not<
	DCommon.IsEqual<
		DCommon.RemoveConstraint<GenericString>,
		string
	>
>;
