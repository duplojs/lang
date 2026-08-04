import { type ComputedTypeError } from "../../types";
import { type Constraint } from "../types";

declare const CastErrorValueSymbol: unique symbol;
declare const CastErrorConstraintSymbol: unique symbol;

export interface CastError<
	GenericReason extends string,
	GenericValue extends unknown,
	GenericConstraint extends Constraint,
> extends ComputedTypeError<GenericReason> {
	[CastErrorValueSymbol]: GenericValue;
	[CastErrorConstraintSymbol]: GenericConstraint;
}
