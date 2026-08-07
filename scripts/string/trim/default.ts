import type { ReapplyAllSizeConstraints, Trimmed } from "../constraints";

type TrimOutput<
	GenericString extends string,
> = ReapplyAllSizeConstraints<
	GenericString,
	string & Trimmed,
	"lengthEqual" | "minCharacters"
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
