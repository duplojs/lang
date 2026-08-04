import type * as DObject from "@scripts/object";
import type * as DCommon from "@scripts/common";
import { type GetConstraint, type Constraint } from "../types";
import { type CastError } from "./error";
import { type ComputeCastStringRule } from "./string";
import { type DArray } from "@scripts";

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
> = DCommon.IsUnion<GenericValue> extends true
	? GenericConstraint extends Constraint
		? DArray.Unwrap<
			DCommon.NeverCoalescing<
				Extract<
					[
						DCommon.NeverCoalescing<
							DObject.Values<
								ComputeCastRule<
									GenericValue,
									GenericConstraint
								>
							>,
							CastError<"None of the intended constraints is possible on the current value.", GenericValue, GenericConstraint>
						>,
					],
					[CastError<string, GenericValue, GenericConstraint>]
				>,
				unknown
			>
		>
		: never
	: CastError<"Value cannot be a union.", GenericValue, GenericConstraint>;

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
