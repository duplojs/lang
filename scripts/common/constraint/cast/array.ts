// oxlint-disable @stylistic/max-len
import type * as DArray from "@scripts/array/constraints";
import type * as DNumber from "@scripts/number";
import { type Constraint } from "../types";
import { type CastError } from "./error";

export interface ComputeCastArrayRule<
	GenericValue extends readonly unknown[],
	GenericExpectedConstraint extends Constraint,
> {
	minElements: DArray.ExtractMinElements<GenericExpectedConstraint, unknown> extends DArray.MinElements<infer InferredTo>
		? InferredTo extends number
			? DArray.ExtractMinElements<GenericValue, unknown> extends DArray.MinElements<infer InferredFrom>
				? InferredFrom extends number
					? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
						? unknown
						: CastError<
							`Impossible to cast on MinElements<${InferredTo}> because constraint MinElements<${InferredFrom}> from the value is less than.`,
							GenericValue,
							GenericExpectedConstraint
						>
					: never
				: DArray.ExtractLengthEqual<GenericValue, unknown> extends DArray.LengthEqual<infer InferredFrom>
					? InferredFrom extends number
						? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
							? unknown
							: CastError<
								`Impossible to cast on MinElements<${InferredTo}> because constraint LengthEqual<${InferredFrom}> from the value is less than.`,
								GenericValue,
								GenericExpectedConstraint
							>
						: never
					: CastError<
						`Impossible to cast on MinElements<${InferredTo}> because value does not have MinElements constraint.`,
						GenericValue,
						GenericExpectedConstraint
					>
			: never
		: never;
	maxElements: DArray.ExtractMaxElements<GenericExpectedConstraint, unknown> extends DArray.MaxElements<infer InferredTo>
		? InferredTo extends number
			? DArray.ExtractMaxElements<GenericValue, unknown> extends DArray.MaxElements<infer InferredFrom>
				? InferredFrom extends number
					? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
						? unknown
						: CastError<
							`Impossible to cast on MaxElements<${InferredTo}> because constraint MaxElements<${InferredFrom}> from the value is more than.`,
							GenericValue,
							GenericExpectedConstraint
						>
					: never
				: DArray.ExtractLengthEqual<GenericValue, unknown> extends DArray.LengthEqual<infer InferredFrom>
					? InferredFrom extends number
						? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
							? unknown
							: CastError<
								`Impossible to cast on MaxElements<${InferredTo}> because constraint LengthEqual<${InferredFrom}> from the value is more than.`,
								GenericValue,
								GenericExpectedConstraint
							>
						: never
					: CastError<
						`Impossible to cast on MaxElements<${InferredTo}> because value does not have MaxElements constraint.`,
						GenericValue,
						GenericExpectedConstraint
					>
			: never
		: never;
}
