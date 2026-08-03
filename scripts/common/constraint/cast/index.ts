import type * as DObject from "@scripts/object";
import type * as DCommon from "@scripts/common";
import { type GetConstraint, type Constraint } from "../types";
import { type CastError } from "./error";
import { type ComputeCastStringRule } from "./string";

export * from "./error";
export * from "./string";

export interface ComputeCastRule<
	GenericValue extends unknown,
	GenericConstraint extends Constraint,
> {
	string: GenericValue extends string
		? DObject.Values<
			ComputeCastStringRule<GenericValue, GenericConstraint>
		>
		: never;
}

export type ComputeCast<
	GenericValue extends unknown,
	GenericConstraint extends Constraint,
> = DCommon.NeverCoalescing<
	DObject.Values<
		ComputeCastRule<
			GenericValue,
			GenericConstraint
		>
	>,
	CastError<"None of the intended constraints is possible on the current value.", GenericValue>
>;

export function cast<
	GenericInput extends unknown,
	GenericResult extends Constraint,
>(
	input: (
		& GenericInput
		& ComputeCast<
			GenericInput,
			GetConstraint<
				GenericResult
			>
		>
	),
): GenericResult;

export function cast(
	input: any,
): any {
	return input;
}
