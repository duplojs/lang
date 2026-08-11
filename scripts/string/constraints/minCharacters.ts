import type * as DCommon from "@scripts/common";
import { type CountMinCharacters, type IsLiteral } from "../types";
import { type IsTemplateLiteral } from "../types/isTemplateLiteral";

export type MinCharactersConstraintName = "string-min-characters";

export interface MinCharacters<
	GenericMin extends number,
> extends DCommon.DynamicConstraint<MinCharactersConstraintName, GenericMin> {}

export type ExtractMinCharacters<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends MinCharacters<number>
	? (
		keyof GenericConstraint[DCommon.ConstraintSymbol][MinCharactersConstraintName]
	) extends infer InferredResult extends number
		? DCommon.UnionToIntersection<
			| (
				InferredResult extends any
					? MinCharacters<InferredResult>
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
		>
		: GenericDefault
	: GenericConstraint extends string
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
			: GenericDefault
		: GenericDefault;
