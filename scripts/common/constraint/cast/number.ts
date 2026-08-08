// oxlint-disable @stylistic/max-len
import type * as DNumber from "@scripts/number";
import { type IsNever, type NeverCoalescing } from "@scripts/common/types";
import { type RemoveConstraint } from "../types";
import { type RemoveCastError, type CastError } from "./error";

export interface ComputeCastConstraintNumberRule<
	GenericValue extends number,
	GenericExpectedConstraint extends unknown,
> {
	greaterThan: DNumber.ExtractGreaterThan<GenericExpectedConstraint, unknown> extends DNumber.GreaterThan<infer InferredTo>
		? InferredTo extends number
			? NeverCoalescing<
				(
					| (
						DNumber.ExtractGreaterThan<GenericValue, unknown> extends DNumber.GreaterThan<infer InferredFrom>
							? InferredFrom extends number
								? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
									? unknown
									: CastError<
										`Impossible to cast on GreaterThan<${InferredTo}> because constraint GreaterThan<${InferredFrom}> from the value is less than.`,
										GenericValue,
										GenericExpectedConstraint
									>
								: never
							: never
					)
					| (
						DNumber.ExtractGreaterThanOrEqual<GenericValue, unknown> extends DNumber.GreaterThanOrEqual<infer InferredFrom>
							? InferredFrom extends number
								? DNumber.IsLess<InferredTo, InferredFrom> extends true
									? unknown
									: CastError<
										`Impossible to cast on GreaterThan<${InferredTo}> because constraint GreaterThanOrEqual<${InferredFrom}> from the value is less than or equal.`,
										GenericValue,
										GenericExpectedConstraint
									>
								: never
							: never
					)
				) extends infer InferredResult
					? IsNever<InferredResult> extends true
						? (
							DNumber.IsLiteral<GenericValue> extends true
								? RemoveConstraint<RemoveCastError<GenericValue>> extends infer InferredFrom extends number
									? DNumber.IsLess<InferredTo, InferredFrom> extends true
										? unknown
										: CastError<
											`Impossible to cast on GreaterThan<${InferredTo}> because literal value '${InferredFrom}' is less than or equal.`,
											GenericValue,
											GenericExpectedConstraint
										>
									: never
								: never
						)
						: InferredResult
					: never,
				CastError<
					`Impossible to cast on GreaterThan<${InferredTo}> because value does not have compatible constraint.`,
					GenericValue,
					GenericExpectedConstraint
				>
			>
			: never
		: never;
	greaterThanOrEqual: DNumber.ExtractGreaterThanOrEqual<GenericExpectedConstraint, unknown> extends DNumber.GreaterThanOrEqual<infer InferredTo>
		? InferredTo extends number
			? NeverCoalescing<
				(
					| (
						DNumber.ExtractGreaterThanOrEqual<GenericValue, unknown> extends DNumber.GreaterThanOrEqual<infer InferredFrom>
							? InferredFrom extends number
								? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
									? unknown
									: CastError<
										`Impossible to cast on GreaterThanOrEqual<${InferredTo}> because constraint GreaterThanOrEqual<${InferredFrom}> from the value is less than.`,
										GenericValue,
										GenericExpectedConstraint
									>
								: never
							: never
					)
					| (
						DNumber.ExtractGreaterThan<GenericValue, unknown> extends DNumber.GreaterThan<infer InferredFrom>
							? InferredFrom extends number
								? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
									? unknown
									: CastError<
										`Impossible to cast on GreaterThanOrEqual<${InferredTo}> because constraint GreaterThan<${InferredFrom}> from the value is less than.`,
										GenericValue,
										GenericExpectedConstraint
									>
								: never
							: never
					)
				) extends infer InferredResult
					? IsNever<InferredResult> extends true
						? (
							DNumber.IsLiteral<GenericValue> extends true
								? RemoveConstraint<RemoveCastError<GenericValue>> extends infer InferredFrom extends number
									? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
										? unknown
										: CastError<
											`Impossible to cast on GreaterThanOrEqual<${InferredTo}> because literal value '${InferredFrom}' is less than.`,
											GenericValue,
											GenericExpectedConstraint
										>
									: never
								: never
						)
						: InferredResult
					: never,
				CastError<
					`Impossible to cast on GreaterThanOrEqual<${InferredTo}> because value does not have compatible constraint.`,
					GenericValue,
					GenericExpectedConstraint
				>
			>
			: never
		: never;
	lessThan: DNumber.ExtractLessThan<GenericExpectedConstraint, unknown> extends DNumber.LessThan<infer InferredTo>
		? InferredTo extends number
			? NeverCoalescing<
				(
					| (
						DNumber.ExtractLessThan<GenericValue, unknown> extends DNumber.LessThan<infer InferredFrom>
							? InferredFrom extends number
								? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
									? unknown
									: CastError<
										`Impossible to cast on LessThan<${InferredTo}> because constraint LessThan<${InferredFrom}> from the value is greater than.`,
										GenericValue,
										GenericExpectedConstraint
									>
								: never
							: never
					)
					| (
						DNumber.ExtractLessThanOrEqual<GenericValue, unknown> extends DNumber.LessThanOrEqual<infer InferredFrom>
							? InferredFrom extends number
								? DNumber.IsGreater<InferredTo, InferredFrom> extends true
									? unknown
									: CastError<
										`Impossible to cast on LessThan<${InferredTo}> because constraint LessThanOrEqual<${InferredFrom}> from the value is greater than or equal.`,
										GenericValue,
										GenericExpectedConstraint
									>
								: never
							: never
					)
				) extends infer InferredResult
					? IsNever<InferredResult> extends true
						? (
							DNumber.IsLiteral<GenericValue> extends true
								? RemoveConstraint<RemoveCastError<GenericValue>> extends infer InferredFrom extends number
									? DNumber.IsGreater<InferredTo, InferredFrom> extends true
										? unknown
										: CastError<
											`Impossible to cast on LessThan<${InferredTo}> because literal value '${InferredFrom}' is greater than or equal.`,
											GenericValue,
											GenericExpectedConstraint
										>
									: never
								: never
						)
						: InferredResult
					: never,
				CastError<
					`Impossible to cast on LessThan<${InferredTo}> because value does not have compatible constraint.`,
					GenericValue,
					GenericExpectedConstraint
				>
			>
			: never
		: never;
	lessThanOrEqual: DNumber.ExtractLessThanOrEqual<GenericExpectedConstraint, unknown> extends DNumber.LessThanOrEqual<infer InferredTo>
		? InferredTo extends number
			? NeverCoalescing<
				(
					| (
						DNumber.ExtractLessThanOrEqual<GenericValue, unknown> extends DNumber.LessThanOrEqual<infer InferredFrom>
							? InferredFrom extends number
								? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
									? unknown
									: CastError<
										`Impossible to cast on LessThanOrEqual<${InferredTo}> because constraint LessThanOrEqual<${InferredFrom}> from the value is greater than.`,
										GenericValue,
										GenericExpectedConstraint
									>
								: never
							: never
					)
					| (
						DNumber.ExtractLessThan<GenericValue, unknown> extends DNumber.LessThan<infer InferredFrom>
							? InferredFrom extends number
								? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
									? unknown
									: CastError<
										`Impossible to cast on LessThanOrEqual<${InferredTo}> because constraint LessThan<${InferredFrom}> from the value is greater than.`,
										GenericValue,
										GenericExpectedConstraint
									>
								: never
							: never
					)
				) extends infer InferredResult
					? IsNever<InferredResult> extends true
						? (
							DNumber.IsLiteral<GenericValue> extends true
								? RemoveConstraint<RemoveCastError<GenericValue>> extends infer InferredFrom extends number
									? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
										? unknown
										: CastError<
											`Impossible to cast on LessThanOrEqual<${InferredTo}> because literal value '${InferredFrom}' is greater than.`,
											GenericValue,
											GenericExpectedConstraint
										>
									: never
								: never
						)
						: InferredResult
					: never,
				CastError<
					`Impossible to cast on LessThanOrEqual<${InferredTo}> because value does not have compatible constraint.`,
					GenericValue,
					GenericExpectedConstraint
				>
			>
			: never
		: never;
}
