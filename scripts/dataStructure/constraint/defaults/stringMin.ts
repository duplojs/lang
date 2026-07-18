import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { createKind } from "../../kind";
import { createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "@scripts/dataStructure/common";

export const stringMinConstraintKind = createKind("string-min-constraint");

export interface StringMinConstraint<
	GenericMin extends number = number,
> extends DCommon.UnionToIntersection<
		& Constraint<
			string,
			string
		>
		& DKind.Kind<typeof stringMinConstraintKind>
	> {
	min: GenericMin;
}

export const StringMinConstraint = createConstraint(
	stringMinConstraintKind,
	({ init }) => <
		GenericMin extends number,
	>(min: GenericMin) => init<
		StringMinConstraint<GenericMin>
	>(
		{ min },
		(self, data) => data.length >= self.min ? SuccessSymbol : ErrorSymbol,
	),
);

