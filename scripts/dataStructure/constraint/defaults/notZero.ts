import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DNumber from "@scripts/number";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const notZeroConstraintKind = createKind("not-zero-constraint");

export interface NotZeroConstraintDefinition extends ConstraintDefinition {

}

export interface NotZeroConstraint extends DCommon.UnionToIntersection<
	& Constraint<
		number,
		number & DNumber.NotZero,
		NotZeroConstraintDefinition
	>
	& DKind.Kind<typeof notZeroConstraintKind>
> {}

export const NotZeroConstraint = createConstraint(
	notZeroConstraintKind,
	({ init }) => () => init<NotZeroConstraint>(
		{},
		{
			executeCheck: (self, data, errorHandler) => DNumber.isNotZero(data)
				? SuccessSymbol
				: errorHandler?.().addIssue(self, data) ?? ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);
