import type { ReapplyCompatiblesConstraints } from "../constraints";

type TrimStartOutput<
	GenericString extends string,
> = ReapplyCompatiblesConstraints<
	GenericString,
	string,
	"maxCharacters"
>;

export function trimStart<
	GenericString extends string,
>(
	string: GenericString,
): TrimStartOutput<GenericString>;

export function trimStart(
	string: string,
) {
	return string.trimStart();
}
