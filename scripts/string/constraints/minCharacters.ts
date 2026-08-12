import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import { type CountMinCharacters, type IsLiteral } from "../types";
import { type IsTemplateLiteral } from "../types/isTemplateLiteral";
import { type LengthEqual } from "./lengthEqual";

export type MinCharactersConstraintName = "string-min-characters";

export interface MinCharacters<
	GenericMin extends number,
> extends DCommon.DynamicConstraint<MinCharactersConstraintName, GenericMin> {}

export type ExtractMinCharacters<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends unknown
	? DCommon.Coalescing<
		DCommon.UnionToIntersection<
			| (
				GenericConstraint extends MinCharacters<infer InferredMin>
					? InferredMin extends number
						? MinCharacters<InferredMin>
						: never
					: never
			)
			| (
				GenericConstraint extends string
					? DCommon.Or<[
						IsLiteral<GenericConstraint>,
						IsTemplateLiteral<GenericConstraint>,
					]> extends true
						? MinCharacters<
							CountMinCharacters<
								Extract<
									DCommon.RemoveConstraint<GenericConstraint>,
									string
								>
							>
						>
						: never
					: never
			)
			| (
				GenericConstraint extends LengthEqual<infer InferredLength>
					? InferredLength extends number
						? MinCharacters<InferredLength>
						: never
					: never
			)
		>,
		unknown,
		GenericDefault
	>
	: never;

export type ComputeMinCharactersCompatibility<
	GenericValue extends unknown,
	GenericExpect extends unknown,
	GenericDefault extends unknown = never,
> = DCommon.NeverCoalescing<
	(
		ExtractMinCharacters<GenericExpect, unknown> extends MinCharacters<infer InferredTo>
			? InferredTo extends number
				? ExtractMinCharacters<GenericValue, unknown> extends MinCharacters<infer InferredFrom>
					? InferredFrom extends number
						? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
							? DCommon.CompatibilityConstraintResult<true, InferredFrom, InferredTo>
							: DCommon.CompatibilityConstraintResult<false, InferredFrom, InferredTo>
						: never
					: never
				: never
			: never
	),
	GenericDefault
>;
