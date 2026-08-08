import type * as DCommon from "@scripts/common";

export type LengthEqualConstraintName = "array-length-equal";

export interface LengthEqual<
	GenericLength extends number,
> extends DCommon.DynamicConstraint<LengthEqualConstraintName, GenericLength> {}

export type ExtractLengthEqual<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends LengthEqual<number>
	? (
		keyof GenericConstraint[DCommon.ConstraintSymbol][LengthEqualConstraintName]
	) extends infer InferredResult extends number
		? DCommon.UnionToIntersection<
			| (
				InferredResult extends any
					? LengthEqual<InferredResult>
					: never
			)
			| (
				GenericConstraint extends DCommon.AnyTuple
					? number extends GenericConstraint["length"]
						? never
						: LengthEqual<GenericConstraint["length"]>
					: never
			)
		>
		: GenericDefault
	: GenericConstraint extends DCommon.AnyTuple
		? number extends GenericConstraint["length"]
			? GenericDefault
			: LengthEqual<GenericConstraint["length"]>
		: GenericDefault;
