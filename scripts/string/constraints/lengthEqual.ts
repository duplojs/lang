import type * as DCommon from "@scripts/common";
import { type IsLiteral, type Length } from "../types";

export type LengthEqualConstraintName = "string-length-equal";

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
				GenericConstraint extends string
					? IsLiteral<GenericConstraint> extends true
						? LengthEqual<
							Length<
								Extract<
									DCommon.RemoveConstraint<GenericConstraint>,
									string
								>
							>
						>
						: never
					: never
			)
		>
		: GenericDefault
	: GenericConstraint extends string
		? IsLiteral<GenericConstraint> extends true
			? LengthEqual<
				Length<
					Extract<
						DCommon.RemoveConstraint<GenericConstraint>,
						string
					>
				>
			>
			: GenericDefault
		: GenericDefault;
