import { type ComputedTypeError } from "../../types";
import { type BaseConstraint } from "../types";

declare const CastErrorValueSymbol: unique symbol;
declare const CastErrorExpectedValueSymbol: unique symbol;

export type RemoveCastError<
	GenericValue extends unknown,
> = GenericValue extends CastError<infer InferredMessage, infer InferredValue, infer InferredExpectedConstraint>
	? GenericValue extends (
		& infer InferredValue
		& CastError<InferredMessage, InferredValue, InferredExpectedConstraint>
	)
		? InferredValue
		: GenericValue
	: GenericValue;

export interface CastError<
	GenericReason extends string,
	GenericValue extends unknown,
	GenericExpectedConstraint extends BaseConstraint,
> extends ComputedTypeError<GenericReason> {
	[CastErrorValueSymbol]: Omit<GenericValue, keyof this>;
	[CastErrorExpectedValueSymbol]: GenericExpectedConstraint;
}
