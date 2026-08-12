import type { At } from "./types";

export function at<
	GenericString extends string,
	GenericIndex extends number,
>(
	index: GenericIndex,
): (
	string: GenericString,
) => At<GenericString, GenericIndex>;

export function at<
	GenericString extends string,
	GenericIndex extends number,
>(
	string: GenericString,
	index: GenericIndex,
): At<GenericString, GenericIndex>;

export function at(
	...args:
		| [index: number]
		| [string: string, index: number]
) {
	if (args.length === 1) {
		const [index] = args;

		return (string: string) => at(string, index);
	}

	const [string, index] = args;

	return string.at(index);
}
