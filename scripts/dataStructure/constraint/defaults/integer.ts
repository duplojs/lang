import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DNumber from "@scripts/number";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const integerConstraintKind = createKind("integer-constraint");

export interface IntegerConstraintDefinition extends ConstraintDefinition {

}

export interface IntegerConstraint extends DCommon.UnionToIntersection<
	& Constraint<
		number,
		number & DNumber.Integer,
		IntegerConstraintDefinition
	>
	& DKind.Kind<typeof integerConstraintKind>
> {}

export const IntegerConstraint = createConstraint(
	integerConstraintKind,
	({ init }) => () => init<IntegerConstraint>(
		{},
		{
			executeCheck: (self, data, errorHandler) => DNumber.isInteger(data)
				? SuccessSymbol
				: errorHandler?.().addIssue(self, data) ?? ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);
