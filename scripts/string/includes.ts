import type * as DCommon from "@scripts/common";

type IncludesOutput<
	GenericString extends string,
	GenericSearchString extends string,
> = Extract<GenericString, `${string}${GenericSearchString}${string}`> extends infer InferredResult extends GenericString
	? DCommon.IsEqual<InferredResult, never> extends true
		? GenericString & `${string}${GenericSearchString}${string}`
		: InferredResult
	: never;

export function includes<
	GenericString extends string,
	GenericSearchString extends string,
>(
	searchString: GenericSearchString,
): (
	string: GenericString,
) => string is IncludesOutput<
	GenericString,
	GenericSearchString
>;

export function includes<
	GenericString extends string,
	GenericSearchString extends string,
>(
	string: GenericString,
	searchString: GenericSearchString,
): string is IncludesOutput<
	GenericString,
	GenericSearchString
>;

export function includes(
	...args:
		| [searchString: string]
		| [string: string, searchString: string]
): any {
	if (args.length === 1) {
		const [searchString] = args;

		return (string: string) => includes(string, searchString);
	}

	const [string, searchString] = args;

	return string.includes(searchString);
}
