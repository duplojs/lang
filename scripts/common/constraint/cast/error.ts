import { type ComputedTypeError } from "../../types";

declare const CastErrorValueSymbol: unique symbol;

export interface CastError<
	GenericReason extends string,
	GenericValue extends unknown,
> extends ComputedTypeError<GenericReason> {
	[CastErrorValueSymbol]: GenericValue;
}
