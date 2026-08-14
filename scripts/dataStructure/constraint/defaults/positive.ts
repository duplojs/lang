import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DNumber from "@scripts/number";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const positiveConstraintKind = createKind("positive-constraint");

export interface PositiveConstraintDefinition extends ConstraintDefinition {

}

export interface PositiveConstraint extends DCommon.UnionToIntersection<
	& Constraint<
		number,
		number & DNumber.Positive,
		PositiveConstraintDefinition
	>
	& DKind.Kind<typeof positiveConstraintKind>
> {}

export const PositiveConstraint = createConstraint(
	positiveConstraintKind,
	({ init }) => () => init<PositiveConstraint>(
		{},
		{
			executeCheck: (self, data, errorHandler) => DNumber.isPositive(data)
				? SuccessSymbol
				: errorHandler?.().addIssue(self, data) ?? ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);
