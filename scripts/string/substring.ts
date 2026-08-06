import type { ReapplyAllowedCharacters, ReapplyAllSizeConstraints } from "./constraints";

type SubstringOutput<
	GenericString extends string,
> = ReapplyAllowedCharacters<
	GenericString,
	ReapplyAllSizeConstraints<GenericString, string, "lengthEqual" | "minCharacters">
>;

export function substring<
	GenericString extends string,
>(
	start: number,
	end?: number,
): (
	string: GenericString,
) => SubstringOutput<GenericString>;

export function substring<
	GenericString extends string,
>(
	string: GenericString,
	start: number,
	end?: number,
): SubstringOutput<GenericString>;

export function substring(
	...args:
		| [start: number, end?: number]
		| [string: string, start: number, end?: number]
) {
	if (typeof args[0] === "number") {
		const [start, end] = args;

		return (string: string) => substring(string, start, end);
	}

	const [string, start, end] = args as [string: string, start: number, end?: number];

	return string.substring(start, end);
}
