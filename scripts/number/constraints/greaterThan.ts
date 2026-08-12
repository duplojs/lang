import type * as DCommon from "@scripts/common";
import { type IsLess, type IsLessOrEqual } from "../types";
import { type ExtractGreaterThanOrEqual, type GreaterThanOrEqual } from "./greaterThanOrEqual";

export type GreaterThanConstraintName = "number-greater-than";

export interface GreaterThan<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<GreaterThanConstraintName, GenericNumber> {}

export type ExtractGreaterThan<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends unknown
	? DCommon.Coalescing<
		DCommon.UnionToIntersection<
			GenericConstraint extends GreaterThan<infer InferredMin>
				? InferredMin extends number
					? GreaterThan<InferredMin>
					: never
				: never
		>,
		unknown,
		GenericDefault
	>
	: never;

export type ComputeGreaterThanCompatibility<
	GenericValue extends unknown,
	GenericExpect extends unknown,
	GenericDefault extends unknown = never,
> = DCommon.NeverCoalescing<
	(
		ExtractGreaterThan<GenericExpect, unknown> extends GreaterThan<infer InferredTo>
			? InferredTo extends number
				? (
					| (
						ExtractGreaterThan<GenericValue, unknown> extends GreaterThan<infer InferredFrom>
							? InferredFrom extends number
								? IsLessOrEqual<InferredTo, InferredFrom> extends true
									? DCommon.CompatibilityConstraintResult<true, InferredFrom, InferredTo>
									: DCommon.CompatibilityConstraintResult<false, InferredFrom, InferredTo>
								: never
							: never
					)
					| (
						ExtractGreaterThanOrEqual<GenericValue, unknown> extends GreaterThanOrEqual<infer InferredFrom>
							? InferredFrom extends number
								? IsLess<InferredTo, InferredFrom> extends true
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
