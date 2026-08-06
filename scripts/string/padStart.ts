import type { ReapplyAllSizeConstraints } from "./constraints";

type PadStartOutput<
	GenericString extends string,
> = ReapplyAllSizeConstraints<GenericString, string, "lengthEqual" | "maxCharacters">;

export function padStart<
	GenericString extends string,
>(
	targetLength: number,
	padString: string,
): (
	string: GenericString,
) => PadStartOutput<GenericString>;

export function padStart<
	GenericString extends string,
>(
	string: GenericString,
	targetLength: number,
	padString: string,
): PadStartOutput<GenericString>;

export function padStart(
	...args:
		| [targetLength: number, padString: string]
		| [string: string, targetLength: number, padString: string]
) {
	if (args.length === 2) {
		const [targetLength, padString] = args;

		return (string: string) => padStart(string, targetLength, padString);
	}

	const [string, targetLength, padString] = args;

	return string.padStart(targetLength, padString);
}
