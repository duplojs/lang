import { type UnionToIntersection, type Constraint, type ConstraintSymbol } from "@scripts/common";

export interface NewType<
	GenericName extends string = string,
	GenericConstraint extends Constraint = Constraint<never>,
> {
	[ConstraintSymbol]: (
		& UnionToIntersection<GenericConstraint>
		& Constraint<"new-type", GenericName>
	)[ConstraintSymbol];
}
