import * as DCommon from "@scripts/common";
import type * as DObject from "@scripts/object";
import type * as DString from "@scripts/string";

type ComputeMatcher<
	GenericTaggedObject extends DCommon.ObjectTag,
> = {
	[TaggedObject in GenericTaggedObject as DCommon.GetTagValue<TaggedObject>]: (value: TaggedObject) => unknown
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

type RequireLiteralTag<
	GenericTaggedObject extends DCommon.ObjectTag,
> = DString.RequireSimpleLiteral<
	DCommon.GetTagValue<GenericTaggedObject>
>;

export function matchWithTaggedObject<
	GenericTaggedObject extends DCommon.ObjectTag,
	GenericMatcher extends ComputeMatcher<GenericTaggedObject>,
>(
	matcher: (
		& DCommon.FixDeepFunctionInfer<
			ComputeMatcher<GenericTaggedObject>,
			GenericMatcher
		>
		& ForbiddenMoreKey<NoInfer<GenericTaggedObject>, GenericMatcher>
	),
): (
	input: GenericTaggedObject & RequireLiteralTag<GenericTaggedObject>,
) => ReturnType<
	Extract<
		NoInfer<GenericMatcher>[keyof GenericMatcher],
		DCommon.AnyFunction
	>
>;

export function matchWithTaggedObject<
	GenericTaggedObject extends DCommon.ObjectTag,
	GenericMatcher extends ComputeMatcher<GenericTaggedObject>,
>(
	input: GenericTaggedObject & RequireLiteralTag<GenericTaggedObject>,
	matcher: (
		& DCommon.FixDeepFunctionInfer<
			ComputeMatcher<GenericTaggedObject>,
			GenericMatcher
		>
		& ForbiddenMoreKey<GenericTaggedObject, GenericMatcher>
	),
): ReturnType<
	Extract<
		GenericMatcher[keyof GenericMatcher],
		DCommon.AnyFunction
	>
>;

export function matchWithTaggedObject(
	...args:
		| [matcher: Record<string, DCommon.AnyFunction>]
		| [input: DCommon.ObjectTag, matcher: Record<string, DCommon.AnyFunction>]
): unknown {
	if (args.length === 1) {
		const [matcher] = args;

		return (input: DCommon.ObjectTag) => matcher[DCommon.getTagValue(input)]!(input);
	}

	const [input, matcher] = args;

	return matcher[DCommon.getTagValue(input)]!(input);
}
