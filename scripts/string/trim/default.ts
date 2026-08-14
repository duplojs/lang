import type { ReapplyCompatiblesConstraints, Trimmed } from "../constraints";

type TrimOutput<
	GenericString extends string,
> = ReapplyCompatiblesConstraints<
	GenericString,
	string & Trimmed,
	"maxCharacters"
>;

export function trim<
	GenericString extends string,
>(
	string: GenericString,
): TrimOutput<GenericString>;

export function trim(
	string: string,
) {
	return string.trim();
}
