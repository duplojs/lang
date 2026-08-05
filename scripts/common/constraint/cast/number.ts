// oxlint-disable @stylistic/max-len
import type * as DNumber from "@scripts/number";
import { type Constraint } from "../types";
import { type CastError } from "./error";

export interface ComputeCastNumberRule<
	GenericValue extends unknown,
	GenericExpectedValue extends Constraint,
> {
	greaterThan: DNumber.ExtractGreaterThan<GenericExpectedValue, unknown> extends DNumber.GreaterThan<infer InferredTo>
		? DNumber.ExtractGreaterThan<GenericValue, unknown> extends DNumber.GreaterThan<infer InferredFrom>
			? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
				? unknown
				: CastError<
					`Impossible to cast on GreaterThan<${InferredTo}> because constraint GreaterThan<${InferredFrom}> from the value is less than.`,
					GenericValue,
					GenericExpectedValue
				>
			: DNumber.ExtractGreaterThanOrEqual<GenericValue, unknown> extends DNumber.GreaterThanOrEqual<infer InferredFrom>
				? DNumber.IsLess<InferredTo, InferredFrom> extends true
					? unknown
					: CastError<
						`Impossible to cast on GreaterThan<${InferredTo}> because constraint GreaterThanOrEqual<${InferredFrom}> from the value is less than or equal.`,
						GenericValue,
						GenericExpectedValue
					>
				: CastError<
					`Impossible to cast on GreaterThan<${InferredTo}> because value does not have compatible constraint.`,
					GenericValue,
					GenericExpectedValue
				>
		: never;
	greaterThanOrEqual: DNumber.ExtractGreaterThanOrEqual<GenericExpectedValue, unknown> extends DNumber.GreaterThanOrEqual<infer InferredTo>
		? DNumber.ExtractGreaterThanOrEqual<GenericValue, unknown> extends DNumber.GreaterThanOrEqual<infer InferredFrom>
			? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
				? unknown
				: CastError<
					`Impossible to cast on GreaterThanOrEqual<${InferredTo}> because constraint GreaterThanOrEqual<${InferredFrom}> from the value is less than.`,
					GenericValue,
					GenericExpectedValue
				>
			: DNumber.ExtractGreaterThan<GenericValue, unknown> extends DNumber.GreaterThan<infer InferredFrom>
				? DNumber.IsLess<InferredTo, InferredFrom> extends true
					? unknown
					: CastError<
						`Impossible to cast on GreaterThanOrEqual<${InferredTo}> because constraint GreaterThan<${InferredFrom}> from the value is less than or equal.`,
						GenericValue,
						GenericExpectedValue
					>
				: CastError<
					`Impossible to cast on GreaterThanOrEqual<${InferredTo}> because value does not have compatible constraint.`,
					GenericValue,
					GenericExpectedValue
				>
		: never;
	lessThan: DNumber.ExtractLessThan<GenericExpectedValue, unknown> extends DNumber.LessThan<infer InferredTo>
		? DNumber.ExtractLessThan<GenericValue, unknown> extends DNumber.LessThan<infer InferredFrom>
			? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
				? unknown
				: CastError<
					`Impossible to cast on LessThan<${InferredTo}> because constraint LessThan<${InferredFrom}> from the value is greater than.`,
					GenericValue,
					GenericExpectedValue
				>
			: DNumber.ExtractLessThanOrEqual<GenericValue, unknown> extends DNumber.LessThanOrEqual<infer InferredFrom>
				? DNumber.IsGreater<InferredTo, InferredFrom> extends true
					? unknown
					: CastError<
						`Impossible to cast on LessThan<${InferredTo}> because constraint LessThanOrEqual<${InferredFrom}> from the value is greater than or equal.`,
						GenericValue,
						GenericExpectedValue
					>
				: CastError<
					`Impossible to cast on LessThan<${InferredTo}> because value does not have compatible constraint.`,
					GenericValue,
					GenericExpectedValue
				>
		: never;
	lessThanOrEqual: DNumber.ExtractLessThanOrEqual<GenericExpectedValue, unknown> extends DNumber.LessThanOrEqual<infer InferredTo>
		? DNumber.ExtractLessThanOrEqual<GenericValue, unknown> extends DNumber.LessThanOrEqual<infer InferredFrom>
			? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
				? unknown
				: CastError<
					`Impossible to cast on LessThanOrEqual<${InferredTo}> because constraint LessThanOrEqual<${InferredFrom}> from the value is greater than.`,
					GenericValue,
					GenericExpectedValue
				>
			: DNumber.ExtractLessThan<GenericValue, unknown> extends DNumber.LessThan<infer InferredFrom>
				? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
					? unknown
					: CastError<
						`Impossible to cast on LessThanOrEqual<${InferredTo}> because constraint LessThan<${InferredFrom}> from the value is greater than.`,
						GenericValue,
						GenericExpectedValue
					>
				: CastError<
					`Impossible to cast on LessThanOrEqual<${InferredTo}> because value does not have compatible constraint.`,
					GenericValue,
					GenericExpectedValue
				>
		: never;
}
