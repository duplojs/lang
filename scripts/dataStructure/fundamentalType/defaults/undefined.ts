import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";

const FundamentalTypeTheUndefinedSymbol = Symbol("FundamentalTypeTheUndefinedSymbol");
export type FundamentalTypeTheUndefinedSymbol = typeof FundamentalTypeTheUndefinedSymbol;

export interface TheUndefined extends FundamentalType<
	FundamentalTypeTheUndefinedSymbol,
	undefined
> {}

export const TheUndefined = createFundamentalType<
	TheUndefined
>(
	FundamentalTypeTheUndefinedSymbol,
	(self, data, errorHandler) => data === undefined
		? SuccessSymbol
		: errorHandler?.().addIssue(self, data) ?? ErrorSymbol,
);
