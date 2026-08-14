import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DNumber from "@scripts/number";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const oddConstraintKind = createKind("odd-constraint");

export interface OddConstraintDefinition extends ConstraintDefinition {

}

export interface OddConstraint extends DCommon.UnionToIntersection<
	& Constraint<
		number,
		number & DNumber.Odd,
		OddConstraintDefinition
	>
	& DKind.Kind<typeof oddConstraintKind>
> {}

export const OddConstraint = createConstraint(
	oddConstraintKind,
	({ init }) => () => init<OddConstraint>(
		{},
		{
			executeCheck: (self, data, errorHandler) => DNumber.isOdd(data)
				? SuccessSymbol
				: errorHandler?.().addIssue(self, data) ?? ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);
