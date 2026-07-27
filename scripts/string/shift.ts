import type { ReapplyAllSizeConstraints } from "./constraints";

type ShiftOutput<
	GenericString extends string,
> = ReapplyAllSizeConstraints<GenericString, string, "lengthEqual" | "minCharacters">;

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
