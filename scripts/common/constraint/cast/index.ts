import type * as DArray from "@scripts/array";
import type * as DObject from "@scripts/object";
import { type ComputeCastArrayRule } from "./array";
import { type Constraint, type UnbundlesConstraint, type RemoveConstraint, type BaseConstraint } from "../types";
import { type CastError } from "./error";
import { type ComputeCastNumberRule } from "./number";
import { type ComputeCastStringRule } from "./string";
import { type BreakGenericLink, type ToLargeEnsemble, type NeverCoalescing, IsExtends, type UnionContain } from "../../types";

export * from "./array";
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
	array: GenericValue extends readonly unknown[]
		? DObject.Values<
			ComputeCastArrayRule<GenericValue, GenericConstraint>
		>
		: never;
}

export type ComputeCast<
	GenericValue extends unknown,
	GenericExpectedValue extends Constraint,
> = (
	GenericExpectedValue extends any
		? [UnbundlesConstraint<GenericExpectedValue>]
		: never
) extends infer InferredComputedExpectedValue extends [BaseConstraint]
	? DArray.Unwrap<
		NeverCoalescing<
			Extract<
				GenericValue extends any
					? (
						InferredComputedExpectedValue extends [infer InferredConstraint extends BaseConstraint]
							? NeverCoalescing<
								Extract<
									InferredConstraint extends any
										? [
											NeverCoalescing<
												DObject.Values<ComputeCastRule<GenericValue, InferredConstraint>>,
												CastError<
													"None of the intended constraints is possible on the current value.",
													GenericValue,
													InferredConstraint
												>
											>,
										]
										: never,
									[CastError<any, any, any>]
								>,
								[unknown]
							>
							: never
					) extends infer InferredResult
						? UnionContain<InferredResult, [unknown]> extends true
							? [unknown]
							: InferredResult
						: never
					: never,
				[CastError<any, any, any>]
			>,
			unknown
		>
	>
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
