import type * as DCommon from "@scripts/common";

export interface NewType<
	GenericName extends string = string,
	GenericConstraint extends DCommon.Constraint = never,
> extends DCommon.BaseConstraint<
		DCommon.SimplifyType<
			& Record<"new-type", GenericName>
			& DCommon.NeverCoalescing<
				GenericConstraint[DCommon.ConstraintSymbol],
				{}
			>
		>
	> {
}
