import type * as DCommon from "@scripts/common";
import type * as DObject from "@scripts/object";
import type * as DString from "@scripts/string/types";

type ComputeMatcher<
	GenericInput extends string,
> = {
	[Prop in GenericInput]: (value: Prop) => unknown
};

type ForbiddenMoreKey<
	GenericInput extends string,
	GenericMatcher extends ComputeMatcher<GenericInput>,
> = DObject.ForbiddenKey<
	GenericMatcher,
	Extract<Exclude<keyof GenericMatcher, GenericInput>, string>
>;

export function matchWithString<
	GenericInput extends string,
	GenericMatcher extends ComputeMatcher<GenericInput>,
>(
	matcher: GenericMatcher
		& ComputeMatcher<NoInfer<GenericInput>>
		& ForbiddenMoreKey<NoInfer<GenericInput>, GenericMatcher>,
): (
	input: GenericInput & DString.RequireSimpleLiteral<GenericInput>,
) => ReturnType<
	NoInfer<GenericMatcher>[keyof GenericMatcher]
>;

export function matchWithString<
	GenericInput extends string,
	GenericMatcher extends ComputeMatcher<GenericInput>,
>(
	input: GenericInput & DString.RequireSimpleLiteral<GenericInput>,
	matcher: DCommon.FixDeepFunctionInfer<
		ComputeMatcher<GenericInput>,
		GenericMatcher
	>
	& ForbiddenMoreKey<GenericInput, GenericMatcher>,
): ReturnType<
	GenericMatcher[keyof GenericMatcher]
>;

export function matchWithString(
	...args:
		| [matcher: Record<string, DCommon.AnyFunction>]
		| [input: string, matcher: Record<string, DCommon.AnyFunction>]
): unknown {
	if (args.length === 1) {
		const [matcher] = args;

		return (input: string) => matcher[input]!(input);
	}

	const [input, matcher] = args;

	return matcher[input]!(input);
}
