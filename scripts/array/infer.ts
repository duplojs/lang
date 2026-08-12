// oxlint-disable @stylistic/max-len
import type * as DCommon from "@scripts/common";
import type * as DTuple from "@scripts/tuple";
import { type MaxElements, type MinElements, type LengthEqual, type ComputeMaxElementsCompatibility, type ComputeMinElementsCompatibility, type ComputeLengthEqualCompatibility } from "./constraints";

type ComputeCompatibilityOutputConstraint<
	GenericOutput extends readonly unknown[],
	GenericInput extends readonly unknown[],
> = (
	DCommon.Or<[
		DCommon.IsNever<GenericOutput>,
		DCommon.IsNever<GenericInput>,
	]> extends true
		? unknown
		: GenericOutput extends unknown
			? (
				| (
					ComputeMaxElementsCompatibility<
						GenericInput,
						GenericOutput,
						unknown
					> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
						? InferredResult extends DCommon.CompatibilityConstraintResult<true>
							? MaxElements<InferredResult["to"]>
							: DCommon.ComputedTypeError<`Impossible to cast on MaxElements<${InferredResult["to"]}> because constraint MaxElements<${InferredResult["from"]}> from the value is more than.`>
						: never
				)
				| (
					ComputeMinElementsCompatibility<
						GenericInput,
						GenericOutput,
						unknown
					> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
						? InferredResult extends DCommon.CompatibilityConstraintResult<true>
							? MinElements<InferredResult["to"]>
							: DCommon.ComputedTypeError<`Impossible to cast on MinElements<${InferredResult["to"]}> because constraint MinElements<${InferredResult["from"]}> from the value is less than.`>
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
	GenericOutput extends readonly unknown[],
	const GenericInput extends readonly [
		...Extract<
			DCommon.RemoveConstraint<GenericOutput>,
			readonly unknown[]
		>,
	] = never,
	GenericConstraint = ComputeCompatibilityOutputConstraint<
		GenericOutput,
		GenericInput
	>,
>(
	input: (
		& GenericInput
		& DTuple.RequireTuple<GenericInput>
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
