// oxlint-disable @stylistic/max-len
import type * as DCommon from "@scripts/common";
import { type MaxCharacters, type MinCharacters, type LengthEqual, type ComputeMaxCharactersCompatibility, type ComputeMinCharactersCompatibility, type ComputeLengthEqualCompatibility } from "./constraints";
import { type RequireLiteral } from "./types";

type ComputeCompatibilityOutputConstraint<
	GenericOutput extends string,
	GenericInput extends string,
> = (
	DCommon.Or<[
		DCommon.IsNever<GenericOutput>,
		DCommon.IsNever<GenericInput>,
	]> extends true
		? unknown
		: GenericOutput extends unknown
			? (
				| (
					ComputeMaxCharactersCompatibility<
						GenericInput,
						GenericOutput,
						unknown
					> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
						? InferredResult extends DCommon.CompatibilityConstraintResult<true>
							? MaxCharacters<InferredResult["to"]>
							: DCommon.ComputedTypeError<`Impossible to cast on MaxCharacters<${InferredResult["to"]}> because constraint MaxCharacters<${InferredResult["from"]}> from the value is more than.`>
						: never
				)
				| (
					ComputeMinCharactersCompatibility<
						GenericInput,
						GenericOutput,
						unknown
					> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
						? InferredResult extends DCommon.CompatibilityConstraintResult<true>
							? MinCharacters<InferredResult["to"]>
							: DCommon.ComputedTypeError<`Impossible to cast on MinCharacters<${InferredResult["to"]}> because constraint MinCharacters<${InferredResult["from"]}> from the value is less than.`>
						: never
				)
				| (
					ComputeLengthEqualCompatibility<
						GenericInput,
						GenericOutput,
						unknown
					> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
						? InferredResult extends DCommon.CompatibilityConstraintResult<true>
							? LengthEqual<InferredResult["to"]>
							: DCommon.ComputedTypeError<`Impossible to cast on LengthEqual<${InferredResult["to"]}> because constraint LengthEqual<${InferredResult["from"]}> from the value is not equal.`>
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
	GenericOutput extends string,
	const GenericInput extends Extract<
		DCommon.RemoveConstraint<GenericOutput>,
		string
	> = never,
	GenericConstraint = ComputeCompatibilityOutputConstraint<
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
