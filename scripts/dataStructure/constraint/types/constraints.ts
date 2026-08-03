import { type Constraint } from "../base";
import type {
	EmailConstraint,
	StringMinConstraint,
} from "../defaults";

export interface ConstraintsStore {
	email: EmailConstraint;
	stringMin: StringMinConstraint;
}

export type Constraints = Extract<
	ConstraintsStore[keyof ConstraintsStore],
	Constraint
>;
