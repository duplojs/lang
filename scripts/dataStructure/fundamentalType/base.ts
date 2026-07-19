import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import { createKind } from "../kind";
import { type SuccessSymbol, type ErrorSymbol } from "../common";

export const fundamentalTypeKind = createKind("fundamental-type");

export interface FundamentalType<
	GenericSymbol extends symbol = symbol,
	IncludedType extends unknown = unknown,
> extends DKind.Kind<
	typeof fundamentalTypeKind,
	IncludedType
	> {
	symbol: GenericSymbol;
	executeCheck(data: unknown): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
}

export function createFundamentalType<
	GenericFundamentalType extends FundamentalType,
>(
	symbol: GenericFundamentalType["symbol"],
	executeCheck: GenericFundamentalType["executeCheck"],
): GenericFundamentalType {
	return fundamentalTypeKind.setTo(
		{
			symbol,
			executeCheck,
		} satisfies DKind.Remove<FundamentalType>,
		null,
	) as never;
}
