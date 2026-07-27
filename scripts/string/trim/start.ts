import type { ReapplyAllSizeConstraints } from "../constraints";

type TrimStartOutput<
	GenericString extends string,
> = ReapplyAllSizeConstraints<
	GenericString,
	string,
	"lengthEqual" | "minCharacters"
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
