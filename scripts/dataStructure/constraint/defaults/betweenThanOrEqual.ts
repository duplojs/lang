import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DNumber from "@scripts/number";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const betweenThanOrEqualConstraintKind = createKind("between-than-or-equal-constraint");

export interface BetweenThanOrEqualConstraintDefinition<
	GenericGreater extends number = number,
	GenericLess extends number = number,
> extends ConstraintDefinition {
	readonly greater: GenericGreater;
	readonly less: GenericLess;
}

export interface BetweenThanOrEqualConstraint<
	GenericGreater extends number = number,
	GenericLess extends number = number,
> extends DCommon.UnionToIntersection<
		& Constraint<
			number,
			number & DNumber.GreaterThanOrEqual<GenericGreater> & DNumber.LessThanOrEqual<GenericLess>,
			BetweenThanOrEqualConstraintDefinition<GenericGreater, GenericLess>
		>
		& DKind.Kind<typeof betweenThanOrEqualConstraintKind>
	> {
}

export const BetweenThanOrEqualConstraint = createConstraint(
	betweenThanOrEqualConstraintKind,
	({ init }) => <
		GenericGreater extends number,
		GenericLess extends number,
	>(greater: GenericGreater, less: GenericLess) => init<
		BetweenThanOrEqualConstraint<GenericGreater, GenericLess>
	>(
		{
			greater,
			less,
		},
		{
			executeCheck: (self, data, errorHandler) => DNumber.betweenThanOrEqual(
				data,
				self.definition.greater,
				self.definition.less,
			)
				? SuccessSymbol
				: errorHandler?.().addIssue(self, data) ?? ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);
