// oxlint-disable @stylistic/max-len
import type * as DNumber from "@scripts/number";
import type * as DString from "@scripts/string";
import { type CastError } from "./error";
import { type IsEqual, type NeverCoalescing } from "@scripts/common/types";
import { type BaseConstraint } from "../types";

export interface ComputeCastConstraintStringRule<
	GenericValue extends string,
	GenericExpectedConstraint extends BaseConstraint,
> {
	maxCharacters: GenericExpectedConstraint extends DString.MaxCharacters<number>
		? DString.ExtractMaxCharacters<GenericExpectedConstraint, unknown> extends DString.MaxCharacters<infer InferredTo>
			? InferredTo extends number
				? NeverCoalescing<
					| (
						DString.ExtractMaxCharacters<GenericValue, unknown> extends DString.MaxCharacters<infer InferredFrom>
							? InferredFrom extends number
								? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
									? unknown
									: CastError<
										`Impossible to cast on MaxCharacters<${InferredTo}> because constraint MaxCharacters<${InferredFrom}> from the value is more than.`,
										GenericValue,
										GenericExpectedConstraint
									>
								: never
							: never
					)
					| (
						DString.ExtractLengthEqual<GenericValue, unknown> extends DString.LengthEqual<infer InferredFrom>
							? InferredFrom extends number
								? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
									? unknown
									: CastError<
										`Impossible to cast on MaxCharacters<${InferredTo}> because constraint LengthEqual<${InferredFrom}> from the value is more than.`,
										GenericValue,
										GenericExpectedConstraint
									>
								: never
							: never
					),
					CastError<
						`Impossible to cast on MaxCharacters<${InferredTo}> because value does not have MaxCharacters constraint.`,
						GenericValue,
						GenericExpectedConstraint
					>
				>
				: never
			: never
		: never;
	minCharacters: GenericExpectedConstraint extends DString.MinCharacters<number>
		? DString.ExtractMinCharacters<GenericExpectedConstraint, unknown> extends DString.MinCharacters<infer InferredTo>
			? InferredTo extends number
				? NeverCoalescing<
					| (
						DString.ExtractMinCharacters<GenericValue, unknown> extends DString.MinCharacters<infer InferredFrom>
							? InferredFrom extends number
								? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
									? unknown
									: CastError<
										`Impossible to cast on MinCharacters<${InferredTo}> because constraint MinCharacters<${InferredFrom}> from the value is less than.`,
										GenericValue,
										GenericExpectedConstraint
									>
								: never
							: never
					)
					| (
						DString.ExtractLengthEqual<GenericValue, unknown> extends DString.LengthEqual<infer InferredFrom>
							? InferredFrom extends number
								? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
									? unknown
									: CastError<
										`Impossible to cast on MaxCharacters<${InferredTo}> because constraint LengthEqual<${InferredFrom}> from the value is less than.`,
										GenericValue,
										GenericExpectedConstraint
									>
								: never
							: never
					),
					CastError<
						`Impossible to cast on MinCharacters<${InferredTo}> because value does not have MinCharacters constraint.`,
						GenericValue,
						GenericExpectedConstraint
					>
				>
				: never
			: never
		: never;
	lengthEqual: GenericExpectedConstraint extends DString.LengthEqual<number>
		? DString.ExtractLengthEqual<GenericExpectedConstraint, unknown> extends DString.LengthEqual<infer InferredTo>
			? InferredTo extends number
				? NeverCoalescing<
					| (
						DString.ExtractLengthEqual<GenericValue, unknown> extends DString.LengthEqual<infer InferredFrom>
							? InferredFrom extends number
								? IsEqual<InferredTo, InferredFrom> extends true
									? unknown
									: CastError<
										`Impossible to cast on LengthEqual<${InferredTo}> because constraint LengthEqual<${InferredFrom}> from the value is not equal.`,
										GenericValue,
										GenericExpectedConstraint
									>
								: never
							: never
					),
					CastError<
						`Impossible to cast on LengthEqual<${InferredTo}> because value does not have LengthEqual constraint.`,
						GenericValue,
						GenericExpectedConstraint
					>
				>
				: never
			: never
		: never;
}
