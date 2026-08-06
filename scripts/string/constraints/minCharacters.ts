import type * as DCommon from "@scripts/common";

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
			InferredResult extends any
				? MinCharacters<InferredResult>
				: never
		>
		: GenericDefault
	: GenericDefault;
