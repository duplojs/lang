import type * as DCommon from "@scripts/common";

export type LengthEqualConstraintName = "array-length-equal";

export interface LengthEqual<
	GenericLength extends number,
> extends DCommon.DynamicConstraint<LengthEqualConstraintName, GenericLength> {}

export type ExtractLengthEqual<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends unknown
	? DCommon.Coalescing<
		DCommon.UnionToIntersection<
			| (
				GenericConstraint extends LengthEqual<infer InferredLength>
					? InferredLength extends number
						? LengthEqual<InferredLength>
						: never
					: never
			)
			| (
				GenericConstraint extends DCommon.AnyTuple
					? number extends GenericConstraint["length"]
						? never
						: LengthEqual<GenericConstraint["length"]>
					: never
			)
		>,
		unknown,
		GenericDefault
	>
	: never;

export type ComputeLengthEqualCompatibility<
	GenericValue extends unknown,
	GenericExpect extends unknown,
	GenericDefault extends unknown = never,
> = DCommon.NeverCoalescing<
	(
		ExtractLengthEqual<GenericExpect, unknown> extends LengthEqual<infer InferredTo>
			? InferredTo extends number
				? ExtractLengthEqual<GenericValue, unknown> extends LengthEqual<infer InferredFrom>
					? InferredFrom extends number
						? DCommon.IsEqual<InferredFrom, InferredTo> extends true
							? DCommon.CompatibilityConstraintResult<true, InferredFrom, InferredTo>
							: DCommon.CompatibilityConstraintResult<false, InferredFrom, InferredTo>
						: never
					: never
				: never
			: never
	),
	GenericDefault
>;
