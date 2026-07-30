import type * as DCommon from "@scripts/common";
import type * as DObject from "@scripts/object";

export interface CharactersRangeStore {

}

export type CharactersRange = Extract<
	DObject.GetPropsWithValue<CharactersRangeStore, true>,
	string
>;

export interface ContainsOnly<
	GenericCharactersRange extends CharactersRange,
> extends DCommon.Constraint<
		"string-contains-only",
		Record<GenericCharactersRange, unknown>
	> {
}
