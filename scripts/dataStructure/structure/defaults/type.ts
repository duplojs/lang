import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { type Constraint } from "../../constraint";
import { type TypeValue, type Type } from "../../type";
import { createStructure, type StructureDefinition, type Structure } from "../base";
import { createKind } from "../../kind";
import { ErrorSymbol } from "../../common";

export const typeStructureKind = createKind("type-structure");

export interface TypeStructureDefinition<
	GenericType extends Type = Type,
	GenericConstraints extends readonly Constraint<TypeValue<GenericType>>[] =
		readonly Constraint<TypeValue<GenericType>>[],
> extends StructureDefinition<GenericConstraints> {
	readonly type: GenericType;
}

export interface TypeStructure<
	GenericType extends Type = Type,
	GenericConstraints extends readonly Constraint<TypeValue<GenericType>>[] =
		readonly Constraint<TypeValue<GenericType>>[],
> extends DCommon.UnionToIntersection<
		& Structure<
			TypeValue<GenericType>,
			TypeStructureDefinition<GenericType, GenericConstraints>
		>
		& DKind.Kind<typeof typeStructureKind>
	> {

	/*
	addConstraint<
		const GenericNewConstraints extends DCommon.AnyTuple<Constraint<TypeValue<GenericType>>>,
	>(
		...args: GenericNewConstraints
	): TypeStructure<
		GenericType,
		readonly [...GenericConstraints, ...GenericNewConstraints]
	>;
	*/
}

export const TypeStructure = createStructure(
	typeStructureKind,
	({ init }) => <
		GenericType extends Type,
		const GenericConstraints extends readonly Constraint<TypeValue<GenericType>>[] = readonly [],
	>(
		type: GenericType,
		constraints: GenericConstraints = [] as never,
	) => init<
		TypeStructure<
			GenericType,
			GenericConstraints
		>
	>(
		{
			type,
			constraints: constraints,
		},
		{
			executeCheck: (self, data, errorHandler) => self.definition.type.executeCheck(data, errorHandler),
			executeEncode: (self, codecContext, data, errorHandler) => DCommon.callThen(
				self.executeCheck(data, errorHandler),
				(result) => {
					if (result === ErrorSymbol) {
						return ErrorSymbol;
					}

					const codec = codecContext.get(self.definition.type.fundamentalType);

					return codec
						? codec.encode(data, errorHandler)
						: data;
				},
			),
			executeDecode: (self, codecContext, data, errorHandler) => {
				const codec = codecContext.get(self.definition.type.fundamentalType);

				return DCommon.callThen(
					codec
						? codec.decode(data, errorHandler)
						: data,
					(decodedData) => decodedData === ErrorSymbol
						? ErrorSymbol
						: DCommon.callThen(
							self.executeCheck(decodedData, errorHandler),
							(result) => result === ErrorSymbol
								? ErrorSymbol
								: decodedData,
						),
				);
			},
			isAsynchronous: (self) => self.definition.type.isAsynchronous(),
		},
	),
);
