import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DString from "@scripts/string";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const stringMinConstraintKind = createKind("string-min-constraint");

export interface StringMinConstraintDefinition<
	GenericMin extends number = number,
> extends ConstraintDefinition {
	readonly min: GenericMin;
}

export interface MinCharactersConstraint<
	GenericMin extends number = number,
> extends DCommon.UnionToIntersection<
		& Constraint<
			string,
			string & DString.MinCharacters<GenericMin>,
			StringMinConstraintDefinition<GenericMin>
		>
		& DKind.Kind<typeof stringMinConstraintKind>
	> {
}

export const MinCharactersConstraint = createConstraint(
	stringMinConstraintKind,
	({ init }) => <
		GenericMin extends number,
	>(min: GenericMin) => init<
		MinCharactersConstraint<GenericMin>
	>(
		{ min },
		{
			executeCheck: (self, data, errorHandler) => DString.minCharacters(
				data,
				DCommon.forward<number>(self.definition.min),
			)
				? SuccessSymbol
				: errorHandler?.().addIssue(self, data) ?? ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);
