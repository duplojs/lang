import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import { type LengthEqual } from "./lengthEqual";

export type MaxElementsConstraintName = "array-max-elements";

export interface MaxElements<
	GenericMax extends number,
> extends DCommon.DynamicConstraint<MaxElementsConstraintName, GenericMax> {}

export type ExtractMaxElements<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends unknown
	? DCommon.Coalescing<
		DCommon.UnionToIntersection<
			| (
				GenericConstraint extends MaxElements<infer InferredMax>
					? InferredMax extends number
						? MaxElements<InferredMax>
						: never
					: never
			)
			| (
				GenericConstraint extends DCommon.AnyTuple
					? number extends GenericConstraint["length"]
						? never
						: MaxElements<GenericConstraint["length"]>
					: never
			)
			| (
				GenericConstraint extends LengthEqual<infer InferredLength>
					? InferredLength extends number
						? MaxElements<InferredLength>
						: never
					: never
			)
		>,
		unknown,
		GenericDefault
	>
	: never;

export type ComputeMaxElementsCompatibility<
	GenericValue extends unknown,
	GenericExpect extends unknown,
	GenericDefault extends unknown = never,
> = DCommon.NeverCoalescing<
	(
		ExtractMaxElements<GenericExpect, unknown> extends MaxElements<infer InferredTo>
			? InferredTo extends number
				? ExtractMaxElements<GenericValue, unknown> extends MaxElements<infer InferredFrom>
					? InferredFrom extends number
						? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
							? DCommon.CompatibilityConstraintResult<true, InferredFrom, InferredTo>
							: DCommon.CompatibilityConstraintResult<false, InferredFrom, InferredTo>
						: never
					: never
				: never
			: never
	),
	GenericDefault
>;
