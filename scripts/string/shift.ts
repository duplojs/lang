import type { ReapplyCompatiblesConstraints } from "./constraints";

type ShiftOutput<
	GenericString extends string,
> = ReapplyCompatiblesConstraints<GenericString, string, "maxCharacters">;

export function shift<
	GenericString extends string,
>(
	string: GenericString,
): ShiftOutput<GenericString>;

export function shift(
	string: string,
) {
	return string.slice(1);
}
