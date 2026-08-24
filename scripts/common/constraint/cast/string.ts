import type * as DString from "@scripts/string";
import type * as DCommon from "@scripts/common";
import type * as DPath from "@scripts/path";
import { type CastError } from "./error";
import { type CompatibilityConstraintResult, type BaseConstraint } from "../types";

export interface ComputeCastConstraintStringRule<
	GenericValue extends string,
	GenericExpectedConstraint extends BaseConstraint,
> {
	maxCharacters: GenericExpectedConstraint extends DString.MaxCharacters<number>
		? DCommon.NeverCoalescing<
			| (
				DString.ComputeMaxCharactersCompatibility<
					GenericValue,
					GenericExpectedConstraint,
					unknown
				> extends infer InferredResult extends CompatibilityConstraintResult<boolean, number, number>
					? InferredResult extends CompatibilityConstraintResult<true>
						? unknown
						: DCommon.IsNever<DString.ExtractLengthEqual<GenericValue>> extends true
							? CastError<
								`Impossible to cast on MaxCharacters<${InferredResult["to"]}> because constraint MaxCharacters<${InferredResult["from"]}> from the value is more than.`,
								GenericValue,
								GenericExpectedConstraint
							>
							: CastError<
								`Impossible to cast on MaxCharacters<${InferredResult["to"]}> because constraint LengthEqual<${InferredResult["from"]}> from the value is more than.`,
								GenericValue,
								GenericExpectedConstraint
							>
					: never
			),
			CastError<
				"Impossible to cast on MaxCharacters because value does not have MaxCharacters constraint.",
				GenericValue,
				GenericExpectedConstraint
			>
		>
		: never;
	minCharacters: GenericExpectedConstraint extends DString.MinCharacters<number>
		? DCommon.NeverCoalescing<
			| (
				DString.ComputeMinCharactersCompatibility<
					GenericValue,
					GenericExpectedConstraint,
					unknown
				> extends infer InferredResult extends CompatibilityConstraintResult<boolean, number, number>
					? InferredResult extends CompatibilityConstraintResult<true>
						? unknown
						: DCommon.IsNever<DString.ExtractLengthEqual<GenericValue>> extends true
							? CastError<
								`Impossible to cast on MinCharacters<${InferredResult["to"]}> because constraint MinCharacters<${InferredResult["from"]}> from the value is less than.`,
								GenericValue,
								GenericExpectedConstraint
							>
							: CastError<
								`Impossible to cast on MinCharacters<${InferredResult["to"]}> because constraint LengthEqual<${InferredResult["from"]}> from the value is less than.`,
								GenericValue,
								GenericExpectedConstraint
							>
					: never
			),
			CastError<
				"Impossible to cast on MinCharacters because value does not have MinCharacters constraint.",
				GenericValue,
				GenericExpectedConstraint
			>
		>
		: never;
	lengthEqual: GenericExpectedConstraint extends DString.LengthEqual<number>
		? DCommon.NeverCoalescing<
			| (
				DString.ComputeLengthEqualCompatibility<
					GenericValue,
					GenericExpectedConstraint,
					unknown
				> extends infer InferredResult extends CompatibilityConstraintResult<boolean, number, number>
					? InferredResult extends CompatibilityConstraintResult<true>
						? unknown
						: CastError<
							`Impossible to cast on LengthEqual<${InferredResult["to"]}> because constraint LengthEqual<${InferredResult["from"]}> from the value is not equal.`,
							GenericValue,
							GenericExpectedConstraint
						>
					: never
			),
			CastError<
				"Impossible to cast on LengthEqual because value does not have LengthEqual constraint.",
				GenericValue,
				GenericExpectedConstraint
			>
		>
		: never;
	path: DCommon.IsExtends<GenericExpectedConstraint, DPath.Path> extends true
		? DCommon.Or<[
			DPath.IsLiteralPath<GenericValue>,
			DCommon.IsExtends<GenericValue, DPath.Path | DPath.Absolute>,
		]> extends true
			? unknown
			: CastError<
				`Impossible to cast on Path because value ${GenericValue} is not path.`,
				GenericValue,
				GenericExpectedConstraint
			>
		: never;
	absolutePath: DCommon.IsExtends<GenericExpectedConstraint, DPath.Absolute> extends true
		? DCommon.Or<[
			DPath.IsLiteralAbsolutePath<GenericValue>,
			DCommon.IsExtends<GenericValue, DPath.Absolute>,
		]> extends true
			? unknown
			: CastError<
				`Impossible to cast on Absolute Path because value ${GenericValue} is not absolute path.`,
				GenericValue,
				GenericExpectedConstraint
			>
		: never;
}
