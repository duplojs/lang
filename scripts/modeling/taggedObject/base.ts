import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import { type Codecs, type EncodedValue } from "@scripts/dataStructure/common";
import { createKind } from "../kind";

declare module "@scripts/dataStructure" {
	interface StructuresStore {
		taggedObject: TaggedObjectStructure;
	}
}

declare module "@scripts/dataStructure/common" {
	interface EncodeStructure<
		GenericValue extends unknown,
		GenericCodecs extends Codecs,
	> {
		taggedObject: GenericValue extends ObjectTag<infer InferredName>
			? (
				& ObjectTag<InferredName>
				& {
					[Prop in Exclude<keyof GenericValue, DKind.KeySymbol>]: EncodedValue<
						GenericValue[Prop],
						GenericCodecs
					>
				}
			)
			: never;
	}
}

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

export type ShapeTaggedObjectStructure<
	GenericTaggedObject extends ObjectTag = ObjectTag,
> = {
	[Prop in Extract<keyof GenericTaggedObject, string>]: DDataStructure.Structure<GenericTaggedObject[Prop]>
};

export const taggedObjectStructureKind = createKind("tagged-object-structure");

export interface TaggedObjectStructureDefinition extends DDataStructure.StructureDefinition<readonly []> {
	readonly inner: DDataStructure.ObjectStructure;
}

export interface TaggedObjectStructure<
	GenericTaggedObject extends ObjectTag = ObjectTag,
> extends DCommon.Forward<
		& DDataStructure.Structure<
			GenericTaggedObject,
			TaggedObjectStructureDefinition
		>
		& DKind.Kind<typeof taggedObjectStructureKind>
	> {
	readonly name: GetTagValue<GenericTaggedObject>;
}

export const TaggedObjectStructure = DDataStructure.createStructure(
	taggedObjectStructureKind,
	({ init }) => <
		GenericTaggedObject extends ObjectTag,
		GenericName extends string = never,
		GenericShape extends DDataStructure.ShapeObjectStructure = never,
	>(
		name: GetTagValue<GenericTaggedObject> | GenericName,
		shape: ShapeTaggedObjectStructure<GenericTaggedObject> | GenericShape,
	): TaggedObjectStructure<
		ObjectTag extends GenericTaggedObject
			? (
				& ObjectTag<GenericName>
				& DDataStructure.ShapeObjectStructureValue<GenericShape>
			)
			: GenericTaggedObject
	> => init<
		TaggedObjectStructure
	>(
		{
			inner: DDataStructure.ObjectStructure(
				{
					...shape,
					[objectTagKind.runTimeKey]: DDataStructure.NonEncodableStringStructure(name),
				},
				[],
			),
			constraints: [],
		},
		{
			executeCheck: (self, data, errorHandler) => self.definition.inner.executeCheck(data, errorHandler),
			executeEncode: (
				self,
				codecContext,
				data,
				errorHandler,
			) => self.definition.inner.executeEncode(codecContext, data, errorHandler),
			executeDecode: (
				self,
				codecContext,
				data,
				errorHandler,
			) => self.definition.inner.executeDecode(codecContext, data, errorHandler),
			isAsynchronous: (self) => self.definition.inner.isAsynchronous(),
		},
		{
			name,
		},
	) as never,
);
