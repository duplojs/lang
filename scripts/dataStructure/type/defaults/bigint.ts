import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as FundamentalType from "../../fundamentalType";
import { createKind } from "../../kind";
import { createType, type Type } from "../base";
import { SuccessSymbol } from "@scripts/dataStructure/common";

export const bigintKind = createKind("bigint-type");

export interface BigintType extends DCommon.UnionToIntersection<
	& Type<
		FundamentalType.TheBigint,
		bigint
	>
	& DKind.Kind<typeof bigintKind>
> {

}

export const BigintType = createType(
	FundamentalType.TheBigint,
	bigintKind,
	({ init }) => () => init<BigintType>(
		{},
		() => SuccessSymbol,
	),
);
