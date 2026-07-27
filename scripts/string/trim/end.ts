import type { ReapplyAllSizeConstraints } from "../constraints";

type TrimEndOutput<
	GenericString extends string,
> = ReapplyAllSizeConstraints<
	GenericString,
	string,
	"lengthEqual" | "minCharacters"
>;

export function trimEnd<
	GenericString extends string,
>(
	string: GenericString,
): TrimEndOutput<GenericString>;

export function trimEnd(
	string: string,
) {
	return string.trimEnd();
}
