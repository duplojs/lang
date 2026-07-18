import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { createKind } from "../../kind";
import { createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "@scripts/dataStructure/common";

export const emailConstraintKind = createKind("email-constraint");

export interface EmailConstraint extends DCommon.UnionToIntersection<
	& Constraint<
		string,
		`${string}@${string}.${string}`
	>
	& DKind.Kind<typeof emailConstraintKind>
> {
	regex: RegExp;
}

export const emailRegex = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;

export const EmailConstraint = createConstraint(
	emailConstraintKind,
	({ init }) => () => init<EmailConstraint>(
		{ regex: emailRegex },
		(self, data) => self.regex.test(data) ? SuccessSymbol : ErrorSymbol,
	),
);

