import type * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";
import { type ContainsOnly, type CharactersRange } from "./constraints";

declare module "./constraints" {
	interface CharactersRangeStore {
		"a-z": true;
		"A-Z": true;
		"A-z": true;
		"0-9": true;
	}
}

type ContainsOnlyOutput<
	GenericValue extends string,
	GenericCharactersRange extends CharactersRange,
> = GenericValue extends ContainsOnly<GenericCharactersRange>
	? GenericValue
	: GenericValue & ContainsOnly<GenericCharactersRange>;

const charactersRangeStore = new Map<CharactersRange, string>([
	["a-z", "a-z"],
	["A-Z", "A-Z"],
	["A-z", "A-z"],
	["0-9", "0-9"],
]);

export function containsOnly<
	GenericValue extends string,
	GenericCharactersRange extends CharactersRange,
>(
	charactersRange: DCommon.MaybeArray<GenericCharactersRange>,
): (
	value: GenericValue,
) => value is ContainsOnlyOutput<
	GenericValue,
	GenericCharactersRange
>;

export function containsOnly<
	GenericValue extends string,
	GenericCharactersRange extends CharactersRange,
>(
	value: GenericValue,
	charactersRange: DCommon.MaybeArray<GenericCharactersRange>,
): value is ContainsOnlyOutput<
	GenericValue,
	GenericCharactersRange
>;

export function containsOnly(
	...args:
		| [charactersRange: DCommon.MaybeArray<CharactersRange>]
		| [value: string, charactersRange: DCommon.MaybeArray<CharactersRange>]
): any {
	if (args.length === 1) {
		const [charactersRange] = args;

		return (value: string) => containsOnly(value, charactersRange);
	}

	const [value, charactersRange] = args;
	const charactersRangePattern = DArray
		.coalescing(charactersRange)
		.map((range) => charactersRangeStore.get(range)!)
		.join("");

	return new RegExp(`^[${charactersRangePattern}]*$`).test(value);
}
