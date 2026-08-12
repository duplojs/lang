// oxlint-disable @stylistic/max-len
import type * as DArray from "@scripts/array/constraints";
import type * as DNumber from "@scripts/number";
import { type CastError } from "./error";
import { type NeverCoalescing, type IsEqual } from "@scripts/common/types";
import { type BaseConstraint } from "../types";

export interface ComputeCastConstraintArrayRule<
	GenericValue extends readonly unknown[],
	GenericExpectedConstraint extends BaseConstraint,
> {
	minElements: GenericExpectedConstraint extends DArray.MinElements<number>
		? DArray.ExtractMinElements<GenericExpectedConstraint, unknown> extends DArray.MinElements<infer InferredTo>
			? InferredTo extends number
				? NeverCoalescing<
					| (
						DArray.ExtractMinElements<GenericValue, unknown> extends DArray.MinElements<infer InferredFrom>
							? InferredFrom extends number
								? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
									? unknown
									: CastError<
										`Impossible to cast on MinElements<${InferredTo}> because constraint MinElements<${InferredFrom}> from the value is less than.`,
										GenericValue,
										GenericExpectedConstraint
									>
								: never
							: never
					)
					| (
						DArray.ExtractLengthEqual<GenericValue, unknown> extends DArray.LengthEqual<infer InferredFrom>
							? InferredFrom extends number
								? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
									? unknown
									: CastError<
										`Impossible to cast on MinElements<${InferredTo}> because constraint LengthEqual<${InferredFrom}> from the value is less than.`,
										GenericValue,
										GenericExpectedConstraint
									>
								: never
							: never
					),
					CastError<
						`Impossible to cast on MinElements<${InferredTo}> because value does not have MinElements constraint.`,
						GenericValue,
						GenericExpectedConstraint
					>
				>
				: never
			: never
		: never;
	maxElements: GenericExpectedConstraint extends DArray.MaxElements<number>
		? DArray.ExtractMaxElements<GenericExpectedConstraint, unknown> extends DArray.MaxElements<infer InferredTo>
			? InferredTo extends number
				? NeverCoalescing<
					| (
						DArray.ExtractMaxElements<GenericValue, unknown> extends DArray.MaxElements<infer InferredFrom>
							? InferredFrom extends number
								? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
									? unknown
									: CastError<
										`Impossible to cast on MaxElements<${InferredTo}> because constraint MaxElements<${InferredFrom}> from the value is more than.`,
										GenericValue,
										GenericExpectedConstraint
									>
								: never
							: never
					)
					| (
						DArray.ExtractLengthEqual<GenericValue, unknown> extends DArray.LengthEqual<infer InferredFrom>
							? InferredFrom extends number
								? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
									? unknown
									: CastError<
										`Impossible to cast on MaxElements<${InferredTo}> because constraint LengthEqual<${InferredFrom}> from the value is more than.`,
										GenericValue,
										GenericExpectedConstraint
									>
								: never
							: never
					),
					CastError<
						`Impossible to cast on MaxElements<${InferredTo}> because value does not have MaxElements constraint.`,
						GenericValue,
						GenericExpectedConstraint
					>
				>
				: never
			: never
		: never;
	lengthEqual: GenericExpectedConstraint extends DArray.LengthEqual<number>
		? DArray.ExtractLengthEqual<GenericExpectedConstraint, unknown> extends DArray.LengthEqual<infer InferredTo>
			? InferredTo extends number
				? NeverCoalescing<
					| (
						DArray.ExtractLengthEqual<GenericValue, unknown> extends DArray.LengthEqual<infer InferredFrom>
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
