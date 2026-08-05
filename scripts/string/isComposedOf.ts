import type * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";
import { type AllowedCharacters, type CharactersRange } from "./constraints";

declare module "./constraints" {
	interface CharactersRangeStore {
		"a-z": true;
		"A-Z": true;
		"A-z": true;
		"0-9": true;
	}
}

type ContainsIsComposedOf<
	GenericValue extends string,
	GenericCharactersRange extends CharactersRange,
> = DCommon.UnionToIntersection<(
	GenericCharactersRange extends any
		? AllowedCharacters<GenericCharactersRange>
		: never
)> extends infer InferredConstraints extends DCommon.Constraint
	? GenericValue extends InferredConstraints
		? GenericValue
		: GenericValue & InferredConstraints
	: never;

const charactersRangeStore = new Map<CharactersRange, string>([
	["a-z", "a-z"],
	["A-Z", "A-Z"],
	["A-z", "A-z"],
	["0-9", "0-9"],
]);

export function isComposedOf<
	GenericValue extends string,
	GenericCharactersRange extends CharactersRange,
>(
	charactersRange: DCommon.MaybeArray<GenericCharactersRange>,
): (
	value: GenericValue,
) => value is ContainsIsComposedOf<
	GenericValue,
	GenericCharactersRange
>;

export function isComposedOf<
	GenericValue extends string,
	GenericCharactersRange extends CharactersRange,
>(
	value: GenericValue,
	charactersRange: DCommon.MaybeArray<GenericCharactersRange>,
): value is ContainsIsComposedOf<
	GenericValue,
	GenericCharactersRange
>;

export function isComposedOf(
	...args:
		| [charactersRange: DCommon.MaybeArray<CharactersRange>]
		| [value: string, charactersRange: DCommon.MaybeArray<CharactersRange>]
): any {
	if (args.length === 1) {
		const [charactersRange] = args;

		return (value: string) => isComposedOf(value, charactersRange);
	}

	const [value, charactersRange] = args;
	const charactersRangePattern = DArray
		.coalescing(charactersRange)
		.map((range) => charactersRangeStore.get(range)!)
		.join("");

	return new RegExp(`^[${charactersRangePattern}]*$`).test(value);
}
