import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as FundamentalType from "../../fundamentalType";
import { createKind } from "../../kind";
import { createType, type TypeDefinition, type Type } from "../base";
import { SuccessSymbol } from "../../common";

export const numberKind = createKind("number-type");

export interface NumberTypeDefinition extends TypeDefinition {}

export interface NumberType extends DCommon.UnionToIntersection<
	& Type<
		FundamentalType.TheNumber,
		number,
		NumberTypeDefinition
	>
	& DKind.Kind<typeof numberKind>
> {

}

export const NumberType = createType(
	FundamentalType.TheNumber,
	numberKind,
	({ init }) => () => init<NumberType>(
		{},
		{
			executeCheck: () => SuccessSymbol,
			isAsynchronous: () => false,
		},
	),
);
