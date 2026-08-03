import { createKindIdentifier } from "@scripts/kind";
import { type Constraint } from "./base";
import { type Constraints } from "./types";

export const constraintIdentifier = createKindIdentifier<
	Constraint,
	Constraints
>();
