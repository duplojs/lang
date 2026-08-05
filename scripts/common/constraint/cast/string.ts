// oxlint-disable @stylistic/max-len
import type * as DNumber from "@scripts/number";
import type * as DString from "@scripts/string";
import { type Constraint } from "../types";
import { type CastError } from "./error";

export interface ComputeCastStringRule<
	GenericValue extends unknown,
	GenericExpectedValue extends Constraint,
> {
	maxCharacters: DString.ExtractMaxCharacters<GenericExpectedValue, unknown> extends DString.MaxCharacters<infer InferredTo>
		? DString.ExtractMaxCharacters<GenericValue, unknown> extends DString.MaxCharacters<infer InferredFrom>
			? InferredTo extends number
				? InferredFrom extends number
					? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
						? unknown
						: CastError<
							`Impossible to cast on MaxCharacters<${InferredTo}> because constraint MaxCharacters<${InferredFrom}> from the value is less than.`,
							GenericValue,
							GenericExpectedValue
						>
					: never
				: never
			: CastError<
				`Impossible to cast on MaxCharacters<${InferredTo}> because value does not have MaxCharacters constraint.`,
				GenericValue,
				GenericExpectedValue
			>
		: never;
	minCharacters: DString.ExtractMinCharacters<GenericExpectedValue, unknown> extends DString.MinCharacters<infer InferredTo>
		? DString.ExtractMinCharacters<GenericValue, unknown> extends DString.MinCharacters<infer InferredFrom>
			? InferredTo extends number
				? InferredFrom extends number
					? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
						? unknown
						: CastError<
							`Impossible to cast on MinCharacters<${InferredTo}> because constraint MinCharacters<${InferredFrom}> from the value is more than.`,
							GenericValue,
							GenericExpectedValue
						>
					: never
				: never
			: CastError<
				`Impossible to cast on MinCharacters<${InferredTo}> because value does not have MinCharacters constraint.`,
				GenericValue,
				GenericExpectedValue
			>
		: never;
}
