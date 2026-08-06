import type { CharactersRange, AllowedCharacters, MaxCharacters } from "./constraints";

type CharAtOutput<
	GenericString extends string,
> = GenericString extends AllowedCharacters<infer InferredCharactersRange extends CharactersRange>
	? string & MaxCharacters<1> & AllowedCharacters<InferredCharactersRange>
	: string & MaxCharacters<1>;

export function charAt<
	GenericString extends string,
>(
	index: number,
): (
	string: GenericString,
) => CharAtOutput<GenericString>;

export function charAt<
	GenericString extends string,
>(
	string: GenericString,
	index: number,
): CharAtOutput<GenericString>;

export function charAt(
	...args:
		| [index: number]
		| [string: string, index: number]
) {
	if (args.length === 1) {
		const [index] = args;

		return (string: string) => charAt(string, index);
	}

	const [string, index] = args;

	return string.charAt(index);
}
