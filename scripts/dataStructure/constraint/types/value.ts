import { type constraintKind, type Constraint } from "../base";
import type * as DKind from "@scripts/kind";

export type ConstraintValue<
	GenericConstraint extends Constraint,
> = DKind.GetValue<typeof constraintKind, GenericConstraint>;
