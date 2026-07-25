import * as DChrono from "@scripts/chrono";
import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";

const FundamentalTypeTheTimeSymbol = Symbol("FundamentalTypeTheTimeSymbol");
export type FundamentalTypeTheTimeSymbol = typeof FundamentalTypeTheTimeSymbol;

export interface TheTime extends FundamentalType<
	FundamentalTypeTheTimeSymbol,
	DChrono.TheTime
> {}

export const TheTime = createFundamentalType<
	TheTime
>(
	FundamentalTypeTheTimeSymbol,
	(self, data, errorHandler) => data instanceof DChrono.TheTime
		? SuccessSymbol
		: errorHandler?.().addIssue(self, data) ?? ErrorSymbol,
);
