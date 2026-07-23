import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";

const FundamentalTypeTheStringSymbol = Symbol("FundamentalTypeTheStringSymbol");
export type FundamentalTypeTheStringSymbol = typeof FundamentalTypeTheStringSymbol;

export interface TheString extends FundamentalType<
	FundamentalTypeTheStringSymbol,
	string
> {}

export const TheString = createFundamentalType<
	TheString
>(
	FundamentalTypeTheStringSymbol,
	(self, data, errorHandler) => typeof data === "string"
		? SuccessSymbol
		: errorHandler?.().addIssue(self, data) ?? ErrorSymbol,
);
