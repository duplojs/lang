import type * as DCommon from "@scripts/common";
import { type IsLiteral } from "../types";

export type GreaterThanOrEqualConstraintName = "number-greater-than-or-equal";

export interface GreaterThanOrEqual<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<GreaterThanOrEqualConstraintName, GenericNumber> {}

export type ExtractGreaterThanOrEqual<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends GreaterThanOrEqual<number>
	? (
		keyof GenericConstraint[DCommon.ConstraintSymbol][GreaterThanOrEqualConstraintName]
	) extends infer InferredResult extends number
		? DCommon.UnionToIntersection<
			| (
				InferredResult extends any
					? GreaterThanOrEqual<InferredResult>
					: never
			)
			| (
				GenericConstraint extends number
					? IsLiteral<GenericConstraint> extends true
						? GreaterThanOrEqual<
							Extract<
								DCommon.RemoveConstraint<GenericConstraint>,
								number
							>
						>
						: never
					: never
			)
		>
		: GenericDefault
	: GenericConstraint extends number
		? IsLiteral<GenericConstraint> extends true
			? GreaterThanOrEqual<
				Extract<
					DCommon.RemoveConstraint<GenericConstraint>,
					number
				>
			>
			: GenericDefault
		: GenericDefault;
