import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";

const FundamentalTypeTheNumberSymbol = Symbol("FundamentalTypeTheNumberSymbol");
export type FundamentalTypeTheNumberSymbol = typeof FundamentalTypeTheNumberSymbol;

export interface TheNumber extends FundamentalType<
	FundamentalTypeTheNumberSymbol,
	number
> {}

export const TheNumber = createFundamentalType<
	TheNumber
>(
	FundamentalTypeTheNumberSymbol,
	(self, data, errorHandler) => typeof data === "number"
		? SuccessSymbol
		: errorHandler?.().addIssue(self) ?? ErrorSymbol,
);
