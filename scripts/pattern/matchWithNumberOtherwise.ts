import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number/types";
import type * as DObject from "@scripts/object";

type ComputeMatcher<GenericInput extends number> = {
	[Prop in GenericInput]?: (value: Prop) => unknown
};

type ForbiddenMoreKey<
	GenericInput extends number,
	GenericMatcher extends ComputeMatcher<GenericInput>,
> = Exclude<keyof GenericMatcher, GenericInput> extends infer InferredKey
	? DCommon.IsEqual<InferredKey, never> extends true
		? unknown
		: DCommon.ComputedTypeError<`Key "${Extract<InferredKey, number>}" is forbidden.`>
	: never;

type HandledKeys<GenericMatcher extends object> = Extract<
	DObject.GetPropsWithValueExtends<GenericMatcher, DCommon.AnyFunction>,
	number
>;

function execute(
	input: number,
	matcher: Record<number, DCommon.AnyFunction | undefined>,
	otherwise: DCommon.AnyFunction,
) {
	const callback = matcher[input];
	return callback === undefined ? otherwise(input) : callback(input);
}

export function matchWithNumberOtherwise<
	GenericInput extends number,
	GenericMatcher extends ComputeMatcher<GenericInput>,
	GenericOutput,
>(
	matcher: GenericMatcher
		& ComputeMatcher<NoInfer<GenericInput>>
		& ForbiddenMoreKey<NoInfer<GenericInput>, GenericMatcher>,
	otherwise: (value: Exclude<GenericInput, HandledKeys<GenericMatcher>>) => GenericOutput,
): (
	input: GenericInput & DNumber.RequireSimpleLiteral<GenericInput>,
) => (
	| ReturnType<Extract<NoInfer<GenericMatcher>[keyof GenericMatcher], DCommon.AnyFunction>>
	| GenericOutput
);

export function matchWithNumberOtherwise<
	GenericInput extends number,
	GenericMatcher extends ComputeMatcher<GenericInput>,
	GenericOutput,
>(
	input: GenericInput & DNumber.RequireSimpleLiteral<GenericInput>,
	matcher: DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericInput>, GenericMatcher>
		& ForbiddenMoreKey<GenericInput, GenericMatcher>,
	otherwise: (value: Exclude<GenericInput, HandledKeys<GenericMatcher>>) => GenericOutput,
): (
	| ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>>
	| GenericOutput
);

export function matchWithNumberOtherwise(
	...args:
		| [
			matcher: Record<number, DCommon.AnyFunction | undefined>,
			otherwise: DCommon.AnyFunction,
		]
		| [
			input: number,
			matcher: Record<number, DCommon.AnyFunction | undefined>,
			otherwise: DCommon.AnyFunction,
		]
): unknown {
	if (args.length === 2) {
		const [matcher, otherwise] = args;
		return (input: number) => execute(input, matcher, otherwise);
	}

	const [input, matcher, otherwise] = args;
	return execute(input, matcher, otherwise);
}
