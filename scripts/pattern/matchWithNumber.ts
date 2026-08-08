import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number/types";

type ComputeMatcher<
	GenericInput extends number,
> = {
	[Prop in GenericInput]: (value: Prop) => unknown
};

type ForbiddenMoreKey<
	GenericInput extends number,
	GenericMatcher extends ComputeMatcher<GenericInput>,
> = Exclude<keyof GenericMatcher, GenericInput> extends infer InferredKey
	? DCommon.IsEqual<InferredKey, never> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Key "${Extract<InferredKey, number>}" is forbidden.`
		>
	: never;

export function matchWithNumber<
	GenericInput extends number,
	GenericMatcher extends ComputeMatcher<GenericInput>,
>(
	matcher: GenericMatcher
		& ComputeMatcher<NoInfer<GenericInput>>
		& ForbiddenMoreKey<NoInfer<GenericInput>, GenericMatcher>,
): (
	input: GenericInput & DNumber.RequireSimpleLiteral<GenericInput>,
) => ReturnType<
	NoInfer<GenericMatcher>[keyof GenericMatcher]
>;

export function matchWithNumber<
	GenericInput extends number,
	GenericMatcher extends ComputeMatcher<GenericInput>,
>(
	input: GenericInput & DNumber.RequireSimpleLiteral<GenericInput>,
	matcher: DCommon.FixDeepFunctionInfer<
		ComputeMatcher<GenericInput>,
		GenericMatcher
	>
	& ForbiddenMoreKey<GenericInput, GenericMatcher>,
): ReturnType<
	GenericMatcher[keyof GenericMatcher]
>;

export function matchWithNumber(
	...args:
		| [matcher: Record<number, DCommon.AnyFunction>]
		| [input: number, matcher: Record<number, DCommon.AnyFunction>]
): unknown {
	if (args.length === 1) {
		const [matcher] = args;

		return (input: number) => matcher[input]!(input);
	}

	const [input, matcher] = args;

	return matcher[input]!(input);
}
