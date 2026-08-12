import type * as DCommon from "@scripts/common";
import { type IsGreater, type IsGreaterOrEqual } from "../types";
import { type ExtractLessThanOrEqual, type LessThanOrEqual } from "./lessThanOrEqual";

export type LessThanConstraintName = "number-greater-less";

export interface LessThan<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<LessThanConstraintName, GenericNumber> {}

export type ExtractLessThan<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends unknown
	? DCommon.Coalescing<
		DCommon.UnionToIntersection<
			GenericConstraint extends LessThan<infer InferredMax>
				? InferredMax extends number
					? LessThan<InferredMax>
					: never
				: never
		>,
		unknown,
		GenericDefault
	>
	: never;

export type ComputeLessThanCompatibility<
	GenericValue extends unknown,
	GenericExpect extends unknown,
	GenericDefault extends unknown = never,
> = DCommon.NeverCoalescing<
	(
		ExtractLessThan<GenericExpect, unknown> extends LessThan<infer InferredTo>
			? InferredTo extends number
				? (
					| (
						ExtractLessThan<GenericValue, unknown> extends LessThan<infer InferredFrom>
							? InferredFrom extends number
								? IsGreaterOrEqual<InferredTo, InferredFrom> extends true
									? DCommon.CompatibilityConstraintResult<true, InferredFrom, InferredTo>
									: DCommon.CompatibilityConstraintResult<false, InferredFrom, InferredTo>
								: never
							: never
					)
					| (
						ExtractLessThanOrEqual<GenericValue, unknown> extends LessThanOrEqual<infer InferredFrom>
							? InferredFrom extends number
								? IsGreater<InferredTo, InferredFrom> extends true
									? DCommon.CompatibilityConstraintResult<true, InferredFrom, InferredTo>
									: DCommon.CompatibilityConstraintResult<false, InferredFrom, InferredTo>
								: never
							: never
					)
				)
				: never
			: never
	),
	GenericDefault
>;
