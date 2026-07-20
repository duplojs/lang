import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as FundamentalType from "../../fundamentalType";
import { createKind } from "../../kind";
import { createType, type TypeDefinition, type Type } from "../base";
import { SuccessSymbol } from "../../common";

export const bigintKind = createKind("bigint-type");

export interface BigintTypeDefinition extends TypeDefinition {}

export interface BigintType extends DCommon.UnionToIntersection<
	& Type<
		FundamentalType.TheBigint,
		bigint,
		BigintTypeDefinition
	>
	& DKind.Kind<typeof bigintKind>
> {

}

export const BigintType = createType(
	FundamentalType.TheBigint,
	bigintKind,
	({ init }) => () => init<BigintType>(
		{},
		{
			executeCheck: () => SuccessSymbol,
			isAsynchronous: () => false,
		},
	),
);
