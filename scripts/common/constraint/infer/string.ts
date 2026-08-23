import type * as DCommon from "@scripts/common";
import type * as DString from "@scripts/string";
import type * as DPath from "@scripts/path";

export interface ComputeInferConstraintStringRule<
	GenericInput extends string,
	GenericOutput extends unknown,
> {
	maxCharacters: DString.ComputeMaxCharactersCompatibility<
		GenericInput,
		GenericOutput,
		unknown
	> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
		? InferredResult extends DCommon.CompatibilityConstraintResult<true>
			? DString.MaxCharacters<InferredResult["to"]>
			: DCommon.ComputedTypeError<`Impossible to cast on MaxCharacters<${InferredResult["to"]}> because constraint MaxCharacters<${InferredResult["from"]}> from the value is more than.`>
		: never;
	minCharacters: DString.ComputeMinCharactersCompatibility<
		GenericInput,
		GenericOutput,
		unknown
	> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
		? InferredResult extends DCommon.CompatibilityConstraintResult<true>
			? DString.MinCharacters<InferredResult["to"]>
			: DCommon.ComputedTypeError<`Impossible to cast on MinCharacters<${InferredResult["to"]}> because constraint MinCharacters<${InferredResult["from"]}> from the value is less than.`>
		: never;
	lengthEqual: DString.ComputeLengthEqualCompatibility<
		GenericInput,
		GenericOutput,
		unknown
	> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
		? InferredResult extends DCommon.CompatibilityConstraintResult<true>
			? DString.LengthEqual<InferredResult["to"]>
			: DCommon.ComputedTypeError<`Impossible to cast on LengthEqual<${InferredResult["to"]}> because constraint LengthEqual<${InferredResult["from"]}> from the value is not equal.`>
		: never;
	path: DCommon.IsExtends<GenericOutput, DPath.Path> extends true
		? DPath.IsLiteralPath<GenericInput> extends true
			? DPath.Path
			: DCommon.ComputedTypeError<`Impossible to cast on Path because value ${GenericInput} is not safe.`>
		: never;
	absolutePath: DCommon.IsExtends<GenericOutput, DPath.Absolute> extends true
		? DPath.IsLiteralAbsolutePath<GenericInput> extends true
			? DPath.Absolute
			: DCommon.ComputedTypeError<`Impossible to cast on Absolute Path because value ${GenericInput} is not safe.`>
		: never;
}
