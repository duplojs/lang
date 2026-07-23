import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const emailConstraintKind = createKind("email-constraint");

export interface EmailConstraintDefinition extends ConstraintDefinition {
	readonly regex: RegExp;
}

export interface EmailConstraint extends DCommon.UnionToIntersection<
	& Constraint<
		string,
		`${string}@${string}.${string}`,
		EmailConstraintDefinition
	>
	& DKind.Kind<typeof emailConstraintKind>
> {}

export const emailRegex = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;

export const EmailConstraint = createConstraint(
	emailConstraintKind,
	({ init }) => () => init<EmailConstraint>(
		{ regex: emailRegex },
		{
			executeCheck: (self, data, errorHandler) => self.definition.regex.test(data)
				? SuccessSymbol
				: errorHandler?.().addIssue(self, data) ?? ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);
