import * as DCommon from "@scripts/common";
import type * as DObject from "@scripts/object";
import type * as DKind from "@scripts/kind";
import * as FundamentalType from "../../fundamentalType";
import { createKind } from "../../kind";
import { createType, type Type } from "../base";
import { type Structure, type StructureValue } from "../../structure";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const objectKind = createKind("object-type");

export type ShapeObjectType = Record<
	string,
	DCommon.MayBeGetter<Structure>
>;

export interface EntryShapeObjectType {
	key: string;
	value: Structure;
}

export type ShapeObjectTypeValue<
	GenericShape extends ShapeObjectType,
> = {
	-readonly [Prop in keyof GenericShape]: StructureValue<
		DCommon.UnwrapGetter<GenericShape[Prop]>
	>
} extends infer InferredResult extends object
	? DObject.PartialKeys<
		InferredResult,
		DObject.GetPropsWithValueExtends<
			InferredResult,
			undefined
		>
	>
	: never;

export interface ObjectType<
	GenericValue extends Record<string, unknown> = {},
> extends DCommon.UnionToIntersection<
	& Type<
		FundamentalType.TheObject,
		GenericValue
	>
	& DKind.Kind<typeof objectKind>
	> {
	readonly shape: DCommon.Memoized<EntryShapeObjectType[]>;
}

export const ObjectType = createType(
	FundamentalType.TheObject,
	objectKind,
	({ init }) => <
		GenericShape extends ShapeObjectType,
	>(
		params: GenericShape,
	) => init<
		ObjectType<ShapeObjectTypeValue<GenericShape>>
	>(
		{
			shape: DCommon.memo(
				() => Object
					.entries(params)
					.map(
						([key, value]) => ({
							key,
							value: typeof value === "function"
								? value()
								: value,
						}),
					),
			),
		},
		(self, data) => self.shape.value.reduce<
			DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>
		>(
			(accumulator, entry) => DCommon.callThen(
				accumulator,
				(awaitedAccumulator) => awaitedAccumulator === ErrorSymbol
					? ErrorSymbol
					: DCommon.callThen(
						entry.value.executeCheck(data[entry.key as never]),
						(awaitedResult) => awaitedResult === ErrorSymbol
							? ErrorSymbol
							: SuccessSymbol,
					),
			),
			SuccessSymbol,
		),
	),
);
