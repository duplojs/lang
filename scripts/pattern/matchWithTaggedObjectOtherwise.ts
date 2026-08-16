import * as DCommon from "@scripts/common";
import type * as DObject from "@scripts/object";
import type * as DString from "@scripts/string";

type ComputeMatcher<
	GenericTaggedObject extends DCommon.ObjectTag,
> = {
	[TaggedObject in GenericTaggedObject as DCommon.GetTagValue<TaggedObject>]?: (value: TaggedObject) => unknown
};

type ForbiddenMoreKey<
	GenericTaggedObject extends DCommon.ObjectTag,
	GenericMatcher extends ComputeMatcher<GenericTaggedObject>,
> = DObject.ForbiddenKey<
	GenericMatcher,
	Extract<
		Exclude<
			keyof GenericMatcher,
			DCommon.GetTagValue<GenericTaggedObject>
		>,
		string
	>
>;

type HandledKeys<
	GenericMatcher extends object,
> = Extract<
	DObject.GetPropsWithValueExtends<GenericMatcher, DCommon.AnyFunction>,
	string
>;

type UnhandledTaggedObject<
	GenericTaggedObject extends DCommon.ObjectTag,
	GenericMatcher extends object,
> = Exclude<
	GenericTaggedObject,
	DCommon.ObjectTag<HandledKeys<GenericMatcher>>
>;

type RequireLiteralTag<
	GenericTaggedObject extends DCommon.ObjectTag,
> = DString.RequireSimpleLiteral<
	DCommon.GetTagValue<GenericTaggedObject>
>;

export function matchWithTaggedObjectOtherwise<
	GenericTaggedObject extends DCommon.ObjectTag,
	GenericMatcher extends ComputeMatcher<GenericTaggedObject>,
	GenericOutput,
>(
	matcher: (
		& DCommon.FixDeepFunctionInfer<
			ComputeMatcher<GenericTaggedObject>,
			GenericMatcher
		>
		& ForbiddenMoreKey<NoInfer<GenericTaggedObject>, GenericMatcher>
	),
	otherwise: (value: UnhandledTaggedObject<GenericTaggedObject, GenericMatcher>) => GenericOutput,
): (
	input: GenericTaggedObject & RequireLiteralTag<GenericTaggedObject>,
) => (
	| ReturnType<
		Extract<
			NoInfer<GenericMatcher>[keyof GenericMatcher],
			DCommon.AnyFunction
		>
	>
	| GenericOutput
);

export function matchWithTaggedObjectOtherwise<
	GenericTaggedObject extends DCommon.ObjectTag,
	GenericMatcher extends ComputeMatcher<GenericTaggedObject>,
	GenericOutput,
>(
	input: GenericTaggedObject & RequireLiteralTag<GenericTaggedObject>,
	matcher: (
		& DCommon.FixDeepFunctionInfer<
			ComputeMatcher<GenericTaggedObject>,
			GenericMatcher
		>
		& ForbiddenMoreKey<GenericTaggedObject, GenericMatcher>
	),
	otherwise: (value: UnhandledTaggedObject<GenericTaggedObject, GenericMatcher>) => GenericOutput,
): (
	| ReturnType<
		Extract<
			GenericMatcher[keyof GenericMatcher],
			DCommon.AnyFunction
		>
	>
	| GenericOutput
);

export function matchWithTaggedObjectOtherwise(
	...args:
		| [
			matcher: Record<string, DCommon.AnyFunction | undefined>,
			otherwise: DCommon.AnyFunction,
		]
		| [
			input: DCommon.ObjectTag,
			matcher: Record<string, DCommon.AnyFunction | undefined>,
			otherwise: DCommon.AnyFunction,
		]
): unknown {
	if (args.length === 2) {
		const [matcher, otherwise] = args;
		return (input: DCommon.ObjectTag) => matchWithTaggedObjectOtherwise(
			input as never,
			matcher as never,
			otherwise,
		);
	}

	const [input, matcher, otherwise] = args;
	const tagValue = DCommon.getTagValue(input);

	return matcher[tagValue] === undefined
		? otherwise(input)
		: matcher[tagValue](input);
}
