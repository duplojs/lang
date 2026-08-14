import type { ReapplyCompatiblesConstraints } from "../constraints";

type TrimEndOutput<
	GenericString extends string,
> = ReapplyCompatiblesConstraints<
	GenericString,
	string,
	"maxCharacters"
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
