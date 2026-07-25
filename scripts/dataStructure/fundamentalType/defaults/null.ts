import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";

const FundamentalTypeTheNullSymbol = Symbol("FundamentalTypeTheNullSymbol");
export type FundamentalTypeTheNullSymbol = typeof FundamentalTypeTheNullSymbol;

export interface TheNull extends FundamentalType<
	FundamentalTypeTheNullSymbol,
	null
> {}

export const TheNull = createFundamentalType<
	TheNull
>(
	FundamentalTypeTheNullSymbol,
	(self, data, errorHandler) => data === null
		? SuccessSymbol
		: errorHandler?.().addIssue(self, data) ?? ErrorSymbol,
);
