import * as DChrono from "@scripts/chrono";
import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";

const FundamentalTypeTheDateSymbol = Symbol("FundamentalTypeTheDateSymbol");
export type FundamentalTypeTheDateSymbol = typeof FundamentalTypeTheDateSymbol;

export interface TheDate extends FundamentalType<
	FundamentalTypeTheDateSymbol,
	DChrono.TheDate
> {}

export const TheDate = createFundamentalType<
	TheDate
>(
	FundamentalTypeTheDateSymbol,
	(self, data, errorHandler) => data instanceof DChrono.TheDate
		? SuccessSymbol
		: errorHandler?.().addIssue(self, data) ?? ErrorSymbol,
);
