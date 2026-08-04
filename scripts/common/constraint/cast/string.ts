import type * as DNumber from "@scripts/number";
import type * as DString from "@scripts/string";
import { type Constraint } from "../types";
import { type CastError } from "./error";

export interface ComputeCastStringRule<
	GenericValue extends unknown,
	GenericConstraint extends Constraint,
> {
	maxCharacters: DString.che<GenericConstraint> extends DString.MaxCharacters<infer InferredTo>
		? GenericValue extends DString.MaxCharacters<infer InferredFrom>
			? InferredFrom extends number
				? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
					? unknown
					: CastError<
						`Impossible to cast on MaxCharacters<${InferredTo}> because constraint MaxCharacters<${InferredFrom}> from the value is less than.`,
						GenericValue,
						GenericConstraint
					>
				: never
			: CastError<
				`Impossible to cast on MaxCharacters<${InferredTo}> because value does not have MaxCharacters constraint.`,
				GenericValue,
				GenericConstraint
			>
		: never;
	minCharacters: GenericConstraint extends DString.MinCharacters<infer InferredTo>
		? GenericValue extends DString.MinCharacters<infer InferredFrom>
			? InferredFrom extends number
				? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
					? unknown
					: CastError<
						`Impossible to cast on MinCharacters<${InferredTo}> because constraint MinCharacters<${InferredFrom}> from the value is more than.`,
						GenericValue,
						GenericConstraint
					>
				: never
			: CastError<
				`Impossible to cast on MinCharacters<${InferredTo}> because value does not have MinCharacters constraint.`,
				GenericValue,
				GenericConstraint
			>
		: never;
}
