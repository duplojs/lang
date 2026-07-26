import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";

const FundamentalTypeTheBooleanSymbol = Symbol("FundamentalTypeTheBooleanSymbol");
export type FundamentalTypeTheBooleanSymbol = typeof FundamentalTypeTheBooleanSymbol;

export interface TheBoolean extends FundamentalType<
	FundamentalTypeTheBooleanSymbol,
	boolean
> {}

export const TheBoolean = createFundamentalType<
	TheBoolean
>(
	FundamentalTypeTheBooleanSymbol,
	(self, data, errorHandler) => typeof data === "boolean"
		? SuccessSymbol
		: errorHandler?.().addIssue(self, data) ?? ErrorSymbol,
);
