import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const stringMinConstraintKind = createKind("string-min-constraint");

export interface StringMinConstraintDefinition<
	GenericMin extends number = number,
> extends ConstraintDefinition {
	readonly min: GenericMin;
}

export interface StringMinConstraint<
	GenericMin extends number = number,
> extends DCommon.UnionToIntersection<
		& Constraint<
			string,
			string,
			StringMinConstraintDefinition<GenericMin>
		>
		& DKind.Kind<typeof stringMinConstraintKind>
	> {
}

export const StringMinConstraint = createConstraint(
	stringMinConstraintKind,
	({ init }) => <
		GenericMin extends number,
	>(min: GenericMin) => init<
		StringMinConstraint<GenericMin>
	>(
		{ min },
		{
			executeCheck: (self, data) => data.length >= self.definition.min
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);
