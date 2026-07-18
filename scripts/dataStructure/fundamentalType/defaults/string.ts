import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";

const FundamentalTypeTheStringSymbol = Symbol("FundamentalTypeTheStringSymbol");
export type FundamentalTypeTheStringSymbol = typeof FundamentalTypeTheStringSymbol;

export interface TheString extends FundamentalType<
	FundamentalTypeTheStringSymbol,
	string,
	never
> {}

export const TheString = createFundamentalType<
	TheString
>(
	FundamentalTypeTheStringSymbol,
	(data) => typeof data === "string" ? SuccessSymbol : ErrorSymbol,
);
