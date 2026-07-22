import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";

const FundamentalTypeTheBigintSymbol = Symbol("FundamentalTypeTheBigintSymbol");
export type FundamentalTypeTheBigintSymbol = typeof FundamentalTypeTheBigintSymbol;

export interface TheBigint extends FundamentalType<
	FundamentalTypeTheBigintSymbol,
	bigint
> {}

export const TheBigint = createFundamentalType<
	TheBigint
>(
	FundamentalTypeTheBigintSymbol,
	(self, data, errorHandler) => typeof data === "bigint"
		? SuccessSymbol
		: errorHandler?.().addIssue(self) ?? ErrorSymbol,
);
