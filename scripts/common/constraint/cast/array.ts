import type * as DArray from "@scripts/array/constraints";
import type * as DNumber from "@scripts/number";
import { type Constraint } from "../types";
import { type CastError } from "./error";

export interface ComputeCastArrayRule<
	GenericValue extends unknown,
	GenericExpectedValue extends Constraint,
> {
	minElements: DArray.ExtractMinElements<GenericExpectedValue, unknown> extends DArray.MinElements<infer InferredTo>
		? InferredTo extends number
			? DArray.ExtractMinElements<GenericValue, unknown> extends DArray.MinElements<infer InferredFrom>
				? InferredFrom extends number
					? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
						? unknown
						: CastError<
							`Impossible to cast on MinElements<${InferredTo}> because constraint MinElements<${InferredFrom}> from the value is less than.`,
							GenericValue,
							GenericExpectedValue
						>
					: never
				: DArray.ExtractLengthEqual<GenericValue, unknown> extends DArray.LengthEqual<infer InferredFrom>
					? InferredFrom extends number
						? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
							? unknown
							: CastError<
								`Impossible to cast on MinElements<${InferredTo}> because constraint LengthEqual<${InferredFrom}> from the value is less than.`,
								GenericValue,
								GenericExpectedValue
							>
						: never
					: CastError<
						`Impossible to cast on MinElements<${InferredTo}> because value does not have MinElements constraint.`,
						GenericValue,
						GenericExpectedValue
					>
			: never
		: never;
	maxElements: DArray.ExtractMaxElements<GenericExpectedValue, unknown> extends DArray.MaxElements<infer InferredTo>
		? InferredTo extends number
			? DArray.ExtractMaxElements<GenericValue, unknown> extends DArray.MaxElements<infer InferredFrom>
				? InferredFrom extends number
					? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
						? unknown
						: CastError<
							`Impossible to cast on MaxElements<${InferredTo}> because constraint MaxElements<${InferredFrom}> from the value is more than.`,
							GenericValue,
							GenericExpectedValue
						>
					: never
				: DArray.ExtractLengthEqual<GenericValue, unknown> extends DArray.LengthEqual<infer InferredFrom>
					? InferredFrom extends number
						? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
							? unknown
							: CastError<
								`Impossible to cast on MaxElements<${InferredTo}> because constraint LengthEqual<${InferredFrom}> from the value is more than.`,
								GenericValue,
								GenericExpectedValue
							>
						: never
					: CastError<
						`Impossible to cast on MaxElements<${InferredTo}> because value does not have MaxElements constraint.`,
						GenericValue,
						GenericExpectedValue
					>
			: never
		: never;
}
