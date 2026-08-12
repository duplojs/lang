// oxlint-disable @stylistic/max-len
import type * as DCommon from "@scripts/common";
import { type ComputeGreaterThanCompatibility, type ComputeGreaterThanOrEqualCompatibility, type ComputeLessThanCompatibility, type ComputeLessThanOrEqualCompatibility, type GreaterThan, type GreaterThanOrEqual, type Integer, type LessThan, type LessThanOrEqual, type NotZero, type Safe } from "./constraints";
import { type IsZero, type IsInteger, type RequireLiteral, type IsSafe } from "./types";

type ComputeOutputBranchConstraint<
	GenericOutput extends number,
	GenericInput extends number,
> = (
	DCommon.Or<[
		DCommon.IsNever<GenericOutput>,
		DCommon.IsNever<GenericInput>,
	]> extends true
		? unknown
		: GenericOutput extends unknown
			? (
				| (
					ComputeGreaterThanCompatibility<
						GenericInput,
						GenericOutput,
						unknown
					> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
						? InferredResult extends DCommon.CompatibilityConstraintResult<true>
							? GreaterThan<InferredResult["to"]>
							: DCommon.ComputedTypeError<`Impossible to cast on GreaterThan<${InferredResult["to"]}> because value ${InferredResult["from"]} is less than or equal.`>
						: never
				)
				| (
					ComputeGreaterThanOrEqualCompatibility<
						GenericInput,
						GenericOutput,
						unknown
					> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
						? InferredResult extends DCommon.CompatibilityConstraintResult<true>
							? GreaterThanOrEqual<InferredResult["to"]>
							: DCommon.ComputedTypeError<`Impossible to cast on GreaterThanOrEqual<${InferredResult["to"]}> because value ${InferredResult["from"]} is less than.`>
						: never
				)
				| (
					ComputeLessThanCompatibility<
						GenericInput,
						GenericOutput,
						unknown
					> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
						? InferredResult extends DCommon.CompatibilityConstraintResult<true>
							? LessThan<InferredResult["to"]>
							: DCommon.ComputedTypeError<`Impossible to cast on LessThan<${InferredResult["to"]}> because value ${InferredResult["from"]} is greater than or equal.`>
						: never
				)
				| (
					ComputeLessThanOrEqualCompatibility<
						GenericInput,
						GenericOutput,
						unknown
					> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
						? InferredResult extends DCommon.CompatibilityConstraintResult<true>
							? LessThanOrEqual<InferredResult["to"]>
							: DCommon.ComputedTypeError<`Impossible to cast on LessThanOrEqual<${InferredResult["to"]}> because value ${InferredResult["from"]} is greater than.`>
						: never
				)
				| (
					DCommon.IsExtends<GenericOutput, Integer> extends true
						? IsInteger<GenericInput> extends true
							? Integer
							: DCommon.ComputedTypeError<`Impossible to cast on Integer because value ${GenericInput} is not an integer.`>
						: never
				)
				| (
					DCommon.IsExtends<GenericOutput, NotZero> extends true
						? IsZero<GenericInput> extends true
							? DCommon.ComputedTypeError<"Impossible to cast on NotZero because value is equal to zero.">
							: NotZero
						: never
				)
				| (
					DCommon.IsExtends<GenericOutput, Safe> extends true
						? IsSafe<GenericInput> extends true
							? Safe
							: DCommon.ComputedTypeError<`Impossible to cast on Safe because value ${GenericInput} is not safe.`>
						: never
				)
			) extends infer InferredResult
				? DCommon.ContainExtends<InferredResult, DCommon.ComputedTypeError<string>> extends true
					? Extract<InferredResult, DCommon.ComputedTypeError<string>>
					: DCommon.UnionToIntersection<InferredResult>
				: never
			: never
) extends infer InferredResult
	? DCommon.ContainExtends<InferredResult, DCommon.BaseConstraint> extends true
		? Extract<InferredResult, DCommon.BaseConstraint>
		: InferredResult
	: never;

export function infer<
	GenericOutput extends number,
	const GenericInput extends Extract<
		DCommon.RemoveConstraint<GenericOutput>,
		number
	> = never,
	GenericConstraint = ComputeOutputBranchConstraint<
		GenericOutput,
		GenericInput
	>,
>(
	input: (
		& GenericInput
		& RequireLiteral<GenericInput>
		& DCommon.ForbiddenUnion<GenericInput>
		& DCommon.BreakGenericLink<
			DCommon.ContainExtends<GenericConstraint, DCommon.ComputedTypeError<string>> extends true
				? GenericConstraint
				: unknown
		>
	),
): DCommon.Or<[
	DCommon.IsNever<GenericInput>,
	DCommon.ContainExtends<GenericConstraint, DCommon.ComputedTypeError<string>>,
]> extends true
	? GenericOutput
	: DCommon.BreakGenericLink<GenericInput & GenericConstraint> {
	return input as never;
}
