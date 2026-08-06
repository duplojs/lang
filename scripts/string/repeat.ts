import type { ReapplyAllowedCharacters } from "./constraints";

type RepeatOutput<
	GenericString extends string,
> = ReapplyAllowedCharacters<GenericString, string>;

export function repeat<
	GenericString extends string,
>(
	count: number,
): (
	string: GenericString,
) => RepeatOutput<GenericString>;

export function repeat<
	GenericString extends string,
>(
	string: GenericString,
	count: number,
): RepeatOutput<GenericString>;

export function repeat(
	...args:
		| [count: number]
		| [string: string, count: number]
) {
	if (args.length === 1) {
		const [count] = args;
		return (string: string) => repeat(string, count);
	}

	const [string, count] = args;

	if (count < 0 || !Number.isFinite(count)) {
		return "";
	}

	return string.repeat(count);
}
