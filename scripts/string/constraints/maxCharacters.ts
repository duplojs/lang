import type * as DCommon from "@scripts/common";

export type MaxCharactersConstraintName = "string-max-characters";

export interface MaxCharacters<
	GenericMax extends number,
> extends DCommon.DynamicConstraint<MaxCharactersConstraintName, GenericMax> {}

export type ExtractMaxCharacters<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends MaxCharacters<number>
	? (
		keyof GenericConstraint[DCommon.ConstraintSymbol][MaxCharactersConstraintName]
	) extends infer InferredResult extends number
		? DCommon.UnionToIntersection<
			InferredResult extends any
				? MaxCharacters<InferredResult>
				: never
		>
		: GenericDefault
	: GenericDefault;
