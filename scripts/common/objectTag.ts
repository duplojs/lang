import type * as DKind from "@scripts/kind";
import { createKind } from "./kind";
import { type ObjectKey, type NeverCoalescing, type SimplifyTopLevel } from "./types";

export const objectTagKind = createKind<
	"object-tag",
	string
>("object-tag");

export interface ObjectTag<
	GenericValue extends string = string,
> extends DKind.Kind<typeof objectTagKind, GenericValue> {

}

export type GetTagValue<
	GenericTaggedObject extends ObjectTag,
> = DKind.GetValue<
	typeof objectTagKind,
	GenericTaggedObject
>;

export type ExtractByTagValue<
	GenericValue extends unknown,
	GenericTagValue extends string,
> = GenericValue extends ObjectTag<GenericTagValue>
	? GenericValue
	: never;

export const getTagValue = objectTagKind.getValue;

export function createTaggedObject<
	GenericTaggedObject extends ObjectTag,
>(): <
	GenericTagValue extends GetTagValue<GenericTaggedObject>,
>(
	tag: GenericTagValue,
	props: SimplifyTopLevel<
		DKind.Remove<
			ExtractByTagValue<
				GenericTaggedObject,
				GenericTagValue
			>
		>
	>,
) => ExtractByTagValue<
	GenericTaggedObject,
	GenericTagValue
>;

export function createTaggedObject<
	GenericTaggedObject extends ObjectTag,
	GenericTag extends GetTagValue<GenericTaggedObject>,
	GenericProps extends DKind.Remove<
		NeverCoalescing<
			ExtractByTagValue<
				GenericTaggedObject,
				GenericTag
			>,
			{ [key: ObjectKey]: unknown }
		>
	>,
>(
	tag: GenericTag,
	props: GenericProps,
): ObjectTag extends GenericTaggedObject
	? (
		& ObjectTag<GenericTag>
		& GenericProps
	)
	: ExtractByTagValue<
		GenericTaggedObject,
		GenericTag
	>;

export function createTaggedObject(
	...args: [] | [
		tag: string,
		props: object,
	]
) {
	if (args.length === 0) {
		return (
			tag: string,
			object: object,
		) => createTaggedObject(tag, object);
	}

	const [tag, props] = args;

	return {
		...props,
		[objectTagKind.runTimeKey]: tag,
	};
}
