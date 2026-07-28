import type * as DCommon from "@scripts/common";
import { type ConstraintValue, type Constraint } from "../../constraint";

export type StructureConstraintsValue<
	GenericConstraints extends Constraint,
> = DCommon.NeverCoalescing<
	Extract<
		DCommon.UnionToIntersection<
			GenericConstraints extends Constraint
				? { value: ConstraintValue<GenericConstraints> }
				: never
		>,
		{ value: unknown }
	>["value"],
	unknown
>;
