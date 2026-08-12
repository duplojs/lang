import type { First } from "./types";

export function first<
	GenericString extends string,
>(
	string: GenericString,
): First<GenericString>;

export function first(
	string: string,
) {
	return string.at(0);
}
