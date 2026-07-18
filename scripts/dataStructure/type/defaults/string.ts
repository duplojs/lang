import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as FundamentalType from "../../fundamentalType";
import { createKind } from "../../kind";
import { createType, type Type } from "../base";
import { SuccessSymbol } from "@scripts/dataStructure/common";

export const stringKind = createKind("string-type");

export interface StringType extends DCommon.UnionToIntersection<
	& Type<
		FundamentalType.TheString,
		string
	>
	& DKind.Kind<typeof stringKind>
> {

}

export const StringType = createType(
	FundamentalType.TheString,
	stringKind,
	({ init }) => () => init<StringType>(
		{},
		() => SuccessSymbol,
	),
);
