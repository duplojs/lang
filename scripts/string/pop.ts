import type { ReapplyAllSizeConstraints } from "./constraints";

type PopOutput<
	GenericString extends string,
> = ReapplyAllSizeConstraints<GenericString, string, "lengthEqual" | "minCharacters">;

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
