import type { ReapplyCompatiblesConstraints } from "./constraints";

type PopOutput<
	GenericString extends string,
> = ReapplyCompatiblesConstraints<GenericString, string, "maxCharacters">;

export function pop<
	GenericString extends string,
>(
	string: GenericString,
): PopOutput<GenericString>;

export function pop(
	string: string,
) {
	return string.slice(0, -1);
}
