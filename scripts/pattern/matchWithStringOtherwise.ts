import type * as DCommon from "@scripts/common";
import type * as DObject from "@scripts/object";
import type * as DString from "@scripts/string/types";

type ComputeMatcher<GenericInput extends string> = {
	[Prop in GenericInput]?: (value: Prop) => unknown
};

type ForbiddenMoreKey<
	GenericInput extends string,
	GenericMatcher extends ComputeMatcher<GenericInput>,
> = DObject.ForbiddenKey<
	GenericMatcher,
	Extract<Exclude<keyof GenericMatcher, GenericInput>, string>
>;

type HandledKeys<GenericMatcher extends object> = Extract<
	DObject.GetPropsWithValueExtends<GenericMatcher, DCommon.AnyFunction>,
	string
>;

function execute(
	input: string,
	matcher: Record<string, DCommon.AnyFunction | undefined>,
	otherwise: DCommon.AnyFunction,
) {
	const callback = matcher[input];
	return callback === undefined ? otherwise(input) : callback(input);
}

export function matchWithStringOtherwise<
	GenericInput extends string,
	GenericMatcher extends ComputeMatcher<GenericInput>,
	GenericOutput,
>(
	matcher: GenericMatcher
		& ComputeMatcher<NoInfer<GenericInput>>
		& ForbiddenMoreKey<NoInfer<GenericInput>, GenericMatcher>,
	otherwise: (value: Exclude<GenericInput, HandledKeys<GenericMatcher>>) => GenericOutput,
): (
	input: GenericInput & DString.RequireSimpleLiteral<GenericInput>,
) => (
	| ReturnType<Extract<NoInfer<GenericMatcher>[keyof GenericMatcher], DCommon.AnyFunction>>
	| GenericOutput
);

export function matchWithStringOtherwise<
	GenericInput extends string,
	GenericMatcher extends ComputeMatcher<GenericInput>,
	GenericOutput,
>(
	input: GenericInput & DString.RequireSimpleLiteral<GenericInput>,
	matcher: DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericInput>, GenericMatcher>
		& ForbiddenMoreKey<GenericInput, GenericMatcher>,
	otherwise: (value: Exclude<GenericInput, HandledKeys<GenericMatcher>>) => GenericOutput,
): (
	| ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>>
	| GenericOutput
);

export function matchWithStringOtherwise(
	...args:
		| [
			matcher: Record<string, DCommon.AnyFunction | undefined>,
			otherwise: DCommon.AnyFunction,
		]
		| [
			input: string,
			matcher: Record<string, DCommon.AnyFunction | undefined>,
			otherwise: DCommon.AnyFunction,
		]
): unknown {
	if (args.length === 2) {
		const [matcher, otherwise] = args;
		return (input: string) => execute(input, matcher, otherwise);
	}

	const [input, matcher, otherwise] = args;
	return execute(input, matcher, otherwise);
}
