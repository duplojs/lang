import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";

const FundamentalTypeTheObjectSymbol = Symbol("FundamentalTypeTheObjectSymbol");
export type FundamentalTypeTheObjectSymbol = typeof FundamentalTypeTheObjectSymbol;

export interface TheObject extends FundamentalType<
	FundamentalTypeTheObjectSymbol,
	object,
	readonly unknown[]
> {}

export const TheObject = createFundamentalType<
	TheObject
>(
	FundamentalTypeTheObjectSymbol,
	(data) => typeof data === "object" && data !== null
		? SuccessSymbol
		: ErrorSymbol,
);
