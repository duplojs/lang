import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { createKind } from "../kind";
import { type SuccessSymbol, type ErrorSymbol, type GetErrorHandler } from "../common";

export const fundamentalTypeKind = createKind("fundamental-type");

export interface FundamentalType<
	GenericSymbol extends symbol = symbol,
	IncludedType extends unknown = unknown,
> extends DKind.Kind<
	typeof fundamentalTypeKind,
	IncludedType
	> {
	symbol: GenericSymbol;
	executeCheck(
		data: unknown,
		errorHandler?: GetErrorHandler
	): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
}

export function createFundamentalType<
	GenericFundamentalType extends FundamentalType,
>(
	symbol: GenericFundamentalType["symbol"],
	executeCheck: (
		self: GenericFundamentalType,
		data: unknown,
		errorHandler?: GetErrorHandler,
	) => DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>,
): GenericFundamentalType {
	const self: DKind.Remove<FundamentalType> = {
		symbol,
		executeCheck: (data, errorHandler) => executeCheck(self as never, data, errorHandler),
		[fundamentalTypeKind.runTimeKey]: null,
	};

	return self as never;
}
