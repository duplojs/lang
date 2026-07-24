import type * as DCommon from "@scripts/common";
import type { Format } from "./constraints";
import type { Split } from "./types";

export interface SplitParams<
	GenericLimit extends number,
> {
	limit: GenericLimit;
}

type SplitOutput<
	GenericString extends string,
	GenericSeparator extends string,
	GenericLimit extends number = number,
> = DCommon.RemoveConstraint<GenericString> extends infer InferredString extends string
	? DCommon.IsEqual<InferredString, string> extends false
		? Split<InferredString, GenericSeparator, GenericLimit>
		: GenericString extends Format<string, infer InferredPattern>
			? Split<InferredPattern, GenericSeparator, GenericLimit>
			: Split<GenericString, GenericSeparator, GenericLimit>
	: never;

export function split<
	GenericString extends string,
	GenericSeparator extends string,
>(
	separator: GenericSeparator | RegExp,
): (string: GenericString) => SplitOutput<GenericString, GenericSeparator>;

export function split<
	GenericString extends string,
	GenericSeparator extends string,
	GenericLimit extends number,
>(
	string: GenericString,
	separator: GenericSeparator | RegExp,
	params?: SplitParams<GenericLimit>,
): SplitOutput<GenericString, GenericSeparator, GenericLimit>;

export function split(
	...args:
	| [separator: string | RegExp]
	| [string: string, separator: string | RegExp, params?: SplitParams<number>]
): any {
	if (args.length === 1) {
		const [separator] = args;
		return (string: string) => split(string, separator);
	}

	const [string, separator, params] = args;

	return string.split(separator, params?.limit);
}

