import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import type * as DObject from "@scripts/object";
import { type Constraint } from "../../constraint";
import { createStructure, type StructureDefinition, type Structure } from "../base";
import { createKind } from "../../kind";

import "../../codec";
import { type StructureValue } from "../types";
import { ErrorSymbol, SuccessSymbol } from "@scripts/dataStructure/common";

declare module "../../codec" {
	interface EncodedComposedStructure<
		GenericValue extends unknown,
		GenericCodec extends Codec,
	> {
		object: GenericValue extends object
			? keyof GenericValue extends string
				? {
					[Prop in keyof GenericValue]: EncodedValue<
						GenericValue[Prop],
						GenericCodec
					>
				}
				: never
			: never;
	}
}

export type ShapeObjectStructure = Record<
	string,
	DCommon.MayBeGetter<Structure>
>;

export interface EntryShapeObjectStructure {
	key: string;
	value: Structure;
}

export type ShapeObjectStructureValue<
	GenericShape extends ShapeObjectStructure,
> = {
	readonly [Prop in keyof GenericShape]: StructureValue<
		DCommon.UnwrapGetter<GenericShape[Prop]>
	>
} extends infer InferredResult extends Record<string, unknown>
	? DObject.PartialKeys<
		InferredResult,
		DObject.GetPropsWithValueExtends<
			InferredResult,
			undefined
		>
	>
	: never;

export const objectStructureKind = createKind("object-structure");

export interface ObjectStructureDefinition<
	GenericConstraints extends readonly Constraint[] = readonly Constraint[],
> extends StructureDefinition<GenericConstraints> {
	readonly shape: DCommon.Memoized<EntryShapeObjectStructure[]>;
}

export interface ObjectStructure<
	GenericValue extends Record<string, unknown> = Record<string, unknown>,
	GenericConstraints extends readonly Constraint<GenericValue>[] =
		readonly Constraint<GenericValue>[],
> extends DCommon.UnionToIntersection<
		& Structure<GenericValue, ObjectStructureDefinition<GenericConstraints>>
		& DKind.Kind<typeof objectStructureKind>
	> {
	readonly definition: ObjectStructureDefinition<
		GenericConstraints
	>;
	addConstraint<
		const GenericNewConstraints extends DCommon.AnyTuple<Constraint<GenericValue>>,
	>(
		...args: GenericNewConstraints
	): ObjectStructure<
		GenericValue,
		readonly [...GenericConstraints, ...GenericNewConstraints]
	>;
}

export const ObjectStructure = createStructure(
	objectStructureKind,
	({ init }) => <
		GenericShape extends ShapeObjectStructure,
		GenericValue extends Record<string, unknown> = ShapeObjectStructureValue<GenericShape>,
		const GenericConstraints extends readonly Constraint<GenericValue>[] = readonly [],
	>(
		shape: GenericShape,
		constraints: GenericConstraints = [] as never,
	) => init<
		ObjectStructure<
			GenericValue,
			GenericConstraints
		>
	>(
		{
			shape: DCommon.memo(
				() => Object
					.entries(shape)
					.map(
						([key, value]) => ({
							key,
							value: typeof value === "function"
								? value()
								: value,
						}),
					),
			),
			constraints: constraints,
		},
		(self, data) => {
			if (
				typeof data !== "object"
				|| data === null
				|| (
					data.constructor !== undefined
					&& data.constructor.name !== "Object"
				)
				|| Object.getOwnPropertySymbols(data).length !== 0
			) {
				return ErrorSymbol;
			}

			return self.definition.shape.value.reduce<
				DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>
			>(
				(accumulator, entry) => DCommon.callThen(
					accumulator,
					(result) => result === ErrorSymbol
						? ErrorSymbol
						: DCommon.callThen(
							entry.value.executeCheck(data[entry.key as never]),
							(result) => result === ErrorSymbol
								? ErrorSymbol
								: SuccessSymbol,
						),
				),
				SuccessSymbol,
			);
		},
	),
);
