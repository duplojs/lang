import type { Last } from "./types";

export function last<
	GenericString extends string,
>(
	string: GenericString,
): Last<GenericString>;

export function last(
	string: string,
) {
	return string.at(-1);
}
