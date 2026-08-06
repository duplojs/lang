import type * as DCommon from "@scripts/common";
import type * as DObject from "@scripts/object";

export interface CharactersRangeStore {

}

export type CharactersRange = Extract<
	DObject.GetPropsWithValue<CharactersRangeStore, true>,
	string
>;

export type AllowedCharactersConstraintName = "string-allowed-characters";

export interface AllowedCharacters<
	GenericCharactersRange extends CharactersRange,
> extends DCommon.Constraint<
		AllowedCharactersConstraintName,
		Record<GenericCharactersRange, unknown>
	> {
}

export type ExtractAllowedCharacters<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends AllowedCharacters<CharactersRange>
	? (
		keyof GenericConstraint[DCommon.ConstraintSymbol][AllowedCharactersConstraintName]
	) extends infer InferredResult extends CharactersRange
		? DCommon.UnionToIntersection<
			InferredResult extends any
				? AllowedCharacters<InferredResult>
				: never
		>
		: GenericDefault
	: GenericDefault;
