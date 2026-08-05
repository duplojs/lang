import type * as DArray from "@scripts/array/types";
import type * as DObject from "@scripts/object/types";
import { type IsNever, type ToLargeEnsemble, type NeverCoalescing, type BreakGenericLink } from "@scripts/common/types";
import { type GetConstraint, type Constraint, type UnbundlesConstraint, type RemoveConstraint } from "../types";
import { type CastError } from "./error";
import { type ComputeCastNumberRule } from "./number";
import { type ComputeCastStringRule } from "./string";

export * from "./error";
export * from "./number";
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
	number: GenericValue extends number
		? DObject.Values<
			ComputeCastNumberRule<GenericValue, GenericConstraint>
		>
		: never;
}

export type ComputeCast<
	GenericValue extends unknown,
	GenericExpectedValue extends Constraint,
> = GenericExpectedValue extends any
	? Extract<GenericValue, RemoveConstraint<GenericExpectedValue>> extends infer InferredValue
		? IsNever<InferredValue> extends true
			? never
			: UnbundlesConstraint<
				Extract<GetConstraint<GenericExpectedValue>, Constraint>
			> extends infer InferredConstraint extends Constraint
				? DArray.Unwrap<
					NeverCoalescing<
						Extract<
							InferredConstraint extends any
								? [
									NeverCoalescing<
										DObject.Values<ComputeCastRule<GenericValue, InferredConstraint>>,
										CastError<"None of the intended constraints is possible on the current value.", GenericValue, InferredConstraint>
									>,
								]
								: never,
							[CastError<any, any, any>]
						>,
						unknown
					>
				>
				: never
		: never
	: never;

export function cast<
	GenericInput extends unknown,
	GenericResult extends (
		& ToLargeEnsemble<RemoveConstraint<GenericInput>>
		& Constraint
	),
	GenericError = ComputeCast<
		GenericInput,
		GenericResult
	>,
>(
	input: (
		& GenericInput
		& BreakGenericLink<GenericError>
	),
): GenericResult;

export function cast(
	input: any,
): any {
	return input;
}
