import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DNumber from "@scripts/number";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const betweenThanConstraintKind = createKind("between-than-constraint");

export interface BetweenThanConstraintDefinition<
	GenericGreater extends number = number,
	GenericLess extends number = number,
> extends ConstraintDefinition {
	readonly greater: GenericGreater;
	readonly less: GenericLess;
}

export interface BetweenThanConstraint<
	GenericGreater extends number = number,
	GenericLess extends number = number,
> extends DCommon.UnionToIntersection<
		& Constraint<
			number,
			number & DNumber.GreaterThan<GenericGreater> & DNumber.LessThan<GenericLess>,
			BetweenThanConstraintDefinition<GenericGreater, GenericLess>
		>
		& DKind.Kind<typeof betweenThanConstraintKind>
	> {
}

export const BetweenThanConstraint = createConstraint(
	betweenThanConstraintKind,
	({ init }) => <
		GenericGreater extends number,
		GenericLess extends number,
	>(greater: GenericGreater, less: GenericLess) => init<
		BetweenThanConstraint<GenericGreater, GenericLess>
	>(
		{
			greater,
			less,
		},
		{
			executeCheck: (self, data, errorHandler) => DNumber.betweenThan(
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
