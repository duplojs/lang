// oxlint-disable @stylistic/max-len
import type * as DNumber from "@scripts/number";
import { type Constraint } from "../types";
import { type CastError } from "./error";

export interface ComputeCastNumberRule<
	GenericValue extends unknown,
	GenericExpectedValue extends Constraint,
> {
	greaterThan: DNumber.ExtractGreaterThan<GenericExpectedValue, unknown> extends DNumber.GreaterThan<infer InferredTo>
		? InferredTo extends number
			? DNumber.ExtractGreaterThan<GenericValue, unknown> extends DNumber.GreaterThan<infer InferredFrom>
				? InferredFrom extends number
					? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
						? unknown
						: CastError<
							`Impossible to cast on GreaterThan<${InferredTo}> because constraint GreaterThan<${InferredFrom}> from the value is less than.`,
							GenericValue,
							GenericExpectedValue
						>
					: never
				: DNumber.ExtractGreaterThanOrEqual<GenericValue, unknown> extends DNumber.GreaterThanOrEqual<infer InferredFrom>
					? InferredFrom extends number
						? DNumber.IsLess<InferredTo, InferredFrom> extends true
							? unknown
							: CastError<
								`Impossible to cast on GreaterThan<${InferredTo}> because constraint GreaterThanOrEqual<${InferredFrom}> from the value is less than or equal.`,
								GenericValue,
								GenericExpectedValue
							>
						: never
					: CastError<
						`Impossible to cast on GreaterThan<${InferredTo}> because value does not have compatible constraint.`,
						GenericValue,
						GenericExpectedValue
					>
			: never
		: never;
	greaterThanOrEqual: DNumber.ExtractGreaterThanOrEqual<GenericExpectedValue, unknown> extends DNumber.GreaterThanOrEqual<infer InferredTo>
		? InferredTo extends number
			? DNumber.ExtractGreaterThanOrEqual<GenericValue, unknown> extends DNumber.GreaterThanOrEqual<infer InferredFrom>
				? InferredFrom extends number
					? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
						? unknown
						: CastError<
							`Impossible to cast on GreaterThanOrEqual<${InferredTo}> because constraint GreaterThanOrEqual<${InferredFrom}> from the value is less than.`,
							GenericValue,
							GenericExpectedValue
						>
					: never
				: DNumber.ExtractGreaterThan<GenericValue, unknown> extends DNumber.GreaterThan<infer InferredFrom>
					? InferredFrom extends number
						? DNumber.IsLess<InferredTo, InferredFrom> extends true
							? unknown
							: CastError<
								`Impossible to cast on GreaterThanOrEqual<${InferredTo}> because constraint GreaterThan<${InferredFrom}> from the value is less than or equal.`,
								GenericValue,
								GenericExpectedValue
							>
						: never
					: CastError<
						`Impossible to cast on GreaterThanOrEqual<${InferredTo}> because value does not have compatible constraint.`,
						GenericValue,
						GenericExpectedValue
					>
			: never
		: never;
	lessThan: DNumber.ExtractLessThan<GenericExpectedValue, unknown> extends DNumber.LessThan<infer InferredTo>
		? InferredTo extends number
			? DNumber.ExtractLessThan<GenericValue, unknown> extends DNumber.LessThan<infer InferredFrom>
				? InferredFrom extends number
					? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
						? unknown
						: CastError<
							`Impossible to cast on LessThan<${InferredTo}> because constraint LessThan<${InferredFrom}> from the value is greater than.`,
							GenericValue,
							GenericExpectedValue
						>
					: never
				: DNumber.ExtractLessThanOrEqual<GenericValue, unknown> extends DNumber.LessThanOrEqual<infer InferredFrom>
					? InferredFrom extends number
						? DNumber.IsGreater<InferredTo, InferredFrom> extends true
							? unknown
							: CastError<
								`Impossible to cast on LessThan<${InferredTo}> because constraint LessThanOrEqual<${InferredFrom}> from the value is greater than or equal.`,
								GenericValue,
								GenericExpectedValue
							>
						: never
					: CastError<
						`Impossible to cast on LessThan<${InferredTo}> because value does not have compatible constraint.`,
						GenericValue,
						GenericExpectedValue
					>
			: never
		: never;
	lessThanOrEqual: DNumber.ExtractLessThanOrEqual<GenericExpectedValue, unknown> extends DNumber.LessThanOrEqual<infer InferredTo>
		? InferredTo extends number
			? DNumber.ExtractLessThanOrEqual<GenericValue, unknown> extends DNumber.LessThanOrEqual<infer InferredFrom>
				? InferredFrom extends number
					? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
						? unknown
						: CastError<
							`Impossible to cast on LessThanOrEqual<${InferredTo}> because constraint LessThanOrEqual<${InferredFrom}> from the value is greater than.`,
							GenericValue,
							GenericExpectedValue
						>
					: never
				: DNumber.ExtractLessThan<GenericValue, unknown> extends DNumber.LessThan<infer InferredFrom>
					? InferredFrom extends number
						? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
							? unknown
							: CastError<
								`Impossible to cast on LessThanOrEqual<${InferredTo}> because constraint LessThan<${InferredFrom}> from the value is greater than.`,
								GenericValue,
								GenericExpectedValue
							>
						: never
					: CastError<
						`Impossible to cast on LessThanOrEqual<${InferredTo}> because value does not have compatible constraint.`,
						GenericValue,
						GenericExpectedValue
					>
			: never
		: never;
}
