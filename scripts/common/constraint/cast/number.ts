// oxlint-disable @stylistic/max-len
import type * as DNumber from "@scripts/number";
import { type NeverCoalescing } from "@scripts/common/types";
import { type CastError } from "./error";
import { type BaseConstraint } from "../types";

export interface ComputeCastConstraintNumberRule<
	GenericValue extends number,
	GenericExpectedConstraint extends BaseConstraint,
> {
	greaterThan: GenericExpectedConstraint extends DNumber.GreaterThan<number> 
		? DNumber.ExtractGreaterThan<GenericExpectedConstraint, unknown> extends DNumber.GreaterThan<infer InferredTo>
			? InferredTo extends number
				? NeverCoalescing<
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
					),
					CastError<
						`Impossible to cast on GreaterThan<${InferredTo}> because value does not have compatible constraint.`,
						GenericValue,
						GenericExpectedConstraint
					>
				>
				: never
			: never
		: never;
	greaterThanOrEqual: GenericExpectedConstraint extends DNumber.GreaterThanOrEqual<number> 
		? DNumber.ExtractGreaterThanOrEqual<GenericExpectedConstraint, unknown> extends DNumber.GreaterThanOrEqual<infer InferredTo>
			? InferredTo extends number
				? NeverCoalescing<
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
					),
					CastError<
						`Impossible to cast on GreaterThanOrEqual<${InferredTo}> because value does not have compatible constraint.`,
						GenericValue,
						GenericExpectedConstraint
					>
				>
				: never
			: never
		: never;
	lessThan: GenericExpectedConstraint extends DNumber.LessThan<number> 
		? DNumber.ExtractLessThan<GenericExpectedConstraint, unknown> extends DNumber.LessThan<infer InferredTo>
			? InferredTo extends number
				? NeverCoalescing<
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
					),
					CastError<
						`Impossible to cast on LessThan<${InferredTo}> because value does not have compatible constraint.`,
						GenericValue,
						GenericExpectedConstraint
					>
				>
				: never
			: never
		: never;
	lessThanOrEqual: GenericExpectedConstraint extends DNumber.LessThanOrEqual<number> 
		? DNumber.ExtractLessThanOrEqual<GenericExpectedConstraint, unknown> extends DNumber.LessThanOrEqual<infer InferredTo>
			? InferredTo extends number
				? NeverCoalescing<
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
					),
					CastError<
						`Impossible to cast on LessThanOrEqual<${InferredTo}> because value does not have compatible constraint.`,
						GenericValue,
						GenericExpectedConstraint
					>
				>
				: never
			: never
		: never;
}
