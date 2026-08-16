import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import { type Codecs, type EncodedValue } from "@scripts/dataStructure/common";
import * as DEither from "@scripts/either";
import * as DObject from "@scripts/object";
import { createKind } from "../kind";
import { type NewType, type NewTypeMap } from "../newType";

declare module "@scripts/dataStructure" {
	interface StructuresStore {
		entity: EntityStructure;
	}
}

declare module "@scripts/dataStructure/common" {
	interface EncodeStructure<
		GenericValue extends unknown,
		GenericCodecs extends Codecs,
	> {
		entity: GenericValue extends Entity<infer InferredName>
			? (
				& Entity<InferredName>
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

export const entityKind = createKind<"entity", string>("entity");

export interface Entity<
	GenericName extends string = string,
> extends DKind.Kind<
		typeof entityKind,
		GenericName
	> {
}

export type GetEntityName<
	GenericEntity extends Entity,
> = GenericEntity extends Entity<infer InferredName>
	? InferredName
	: never;

export const entityStructureKind = createKind("entity-structure");

export interface EntityStructureDefinition extends DDataStructure.StructureDefinition<readonly []> {
	readonly inner: DCommon.Memoized<DDataStructure.ObjectStructure>;
}

export type EntityMap<
	GenericValue extends unknown,
	GenericRawValue = DCommon.RemoveConstraint<GenericValue>,
> = GenericRawValue extends NewType
	? NewTypeMap<GenericRawValue>
	: GenericRawValue extends Entity
		? GenericRawValue
		: GenericRawValue extends object
			? DCommon.Or<[
				DCommon.IsExtends<GenericRawValue, readonly any[]>,
				DCommon.And<[
					DCommon.IsExtends<keyof GenericRawValue, string>,
					DCommon.Not<DCommon.IsExtends<DCommon.AnyFunction, GenericRawValue[keyof GenericRawValue]>>,
				]>,
			]> extends true
				? { [Prop in keyof GenericRawValue]: NewTypeMap<GenericRawValue[Prop]> }
				: GenericRawValue
			: GenericRawValue;

export interface EntityStructure<
	GenericName extends string = string,
	GenericProperties extends Record<string, unknown> = Record<string, unknown>,
> extends DCommon.UnionToIntersection<
		& DDataStructure.Structure<
			& Entity<GenericName>
			& GenericProperties,
			EntityStructureDefinition
		>
		& DKind.Kind<typeof entityStructureKind>
	> {
	readonly name: GenericName;

	"new"<
		GenericNewProperties extends GenericProperties,
	>(
		properties: GenericNewProperties
	): (
		& Entity<GenericName>
		& GenericNewProperties
	);

	decodeMap<
		GenericCodecs extends DDataStructure.Codecs,
	>(
		codecs: GenericCodecs,
	): (
		data: DDataStructure.EncodedValue<
			EntityMap<
				DKind.Remove<
					DDataStructure.StructureValue<this>
				>
			>,
			GenericCodecs
		>,
	) => (
		| DEither.Right<
			"map-success",
			DDataStructure.StructureValue<this>
		>
		| DEither.Left<"async-error", undefined>
		| DEither.Left<"map-error", DDataStructure.Error>
	);
	decodeMap<
		GenericCodecs extends DDataStructure.Codecs,
	>(
		codecs: GenericCodecs,
		data: DDataStructure.EncodedValue<
			EntityMap<
				DKind.Remove<
					DDataStructure.StructureValue<this>
				>
			>,
			GenericCodecs
		>,
	): (
		| DEither.Right<
			"map-success",
			DDataStructure.StructureValue<this>
		>
		| DEither.Left<"async-error", undefined>
		| DEither.Left<"map-error", DDataStructure.Error>
	);
	map(
		data: EntityMap<
			DKind.Remove<
				DDataStructure.StructureValue<this>
			>
		>
	): (
		| DEither.Right<
			"map-success",
			DDataStructure.StructureValue<this>
		>
		| DEither.Left<"async-error", undefined>
		| DEither.Left<"map-error", DDataStructure.Error>
	);

	asyncDecodeMap<
		GenericCodecs extends DDataStructure.Codecs,
	>(
		codecs: GenericCodecs,
	): (
		data: DDataStructure.EncodedValue<
			EntityMap<
				DKind.Remove<
					DDataStructure.StructureValue<this>
				>
			>,
			GenericCodecs
		>,
	) => Promise<
		| DEither.Right<
			"map-success",
			DDataStructure.StructureValue<this>
		>
		| DEither.Left<"map-error", DDataStructure.Error>
	>;
	asyncDecodeMap<
		GenericCodecs extends DDataStructure.Codecs,
	>(
		codecs: GenericCodecs,
		data: DDataStructure.EncodedValue<
			EntityMap<
				DKind.Remove<
					DDataStructure.StructureValue<this>
				>
			>,
			GenericCodecs
		>,
	): Promise<
		| DEither.Right<
			"map-success",
			DDataStructure.StructureValue<this>
		>
		| DEither.Left<"map-error", DDataStructure.Error>
	>;
	asyncMap(
		data: EntityMap<
			DKind.Remove<
				DDataStructure.StructureValue<this>
			>
		>
	): Promise<
		| DEither.Right<
			"map-success",
			DDataStructure.StructureValue<this>
		>
		| DEither.Left<"map-error", DDataStructure.Error>
	>;
}

export const EntityStructure = DDataStructure.createStructure(
	entityStructureKind,
	({ init }) => <
		GenericName extends string,
		GenericShape extends DDataStructure.ShapeObjectStructure,
		const GenericProperties extends DDataStructure.ShapeObjectStructureValue<GenericShape>,
	>(
		name: GenericName,
		shape: () => GenericShape,
	): EntityStructure<
		GenericName,
		GenericProperties
	> => init<
		EntityStructure
	>(
		{
			inner: DCommon.memo(
				() => DDataStructure.ObjectStructure(
					{
						...shape(),
						[entityKind.runTimeKey]: DDataStructure.NonEncodableStringStructure(name),
					},
					[],
				),
			),
			constraints: [],
		},
		{
			executeCheck: (self, data, errorHandler) => self.definition.inner.value.executeCheck(data, errorHandler),
			executeEncode: (
				self,
				codecContext,
				data,
				errorHandler,
			) => self.definition.inner.value.executeEncode(codecContext, data, errorHandler),
			executeDecode: (
				self,
				codecContext,
				data,
				errorHandler,
			) => self.definition.inner.value.executeDecode(codecContext, data, errorHandler),
			isAsynchronous: (self) => self.definition.inner.value.isAsynchronous(),
		},
		{
			name,
			new: (self, properties) => ({
				...properties,
				[entityKind.runTimeKey]: name,
			}) as never,
			decodeMap: (
				self,
				...args: | [DDataStructure.Codecs, unknown]
					| [DDataStructure.Codecs]
			): any => {
				if (args.length === 1) {
					const [codecs] = args;
					return (value: never) => self.decodeMap(codecs, value);
				}

				const errorHandler = DDataStructure.createGetErrorHandler();
				const [codecs, data] = args;

				const result = self.executeDecode(
					codecs.context.value,
					DObject.isSimple(data)
						? {
							...data,
							[entityKind.runTimeKey]: name,
						}
						: data,
					errorHandler,
				);

				if (result instanceof Promise) {
					return DEither.left("async-error", undefined);
				}

				if (result === DDataStructure.ErrorSymbol) {
					return DEither.left("map-error", errorHandler().createError());
				}

				return DEither.right("map-success", result as never);
			},
			map: (
				self,
				data,
			): any => {
				const errorHandler = DDataStructure.createGetErrorHandler();

				const formattedData = DObject.isSimple(data)
					? {
						...data,
						[entityKind.runTimeKey]: name,
					}
					: data;

				const result = self.executeCheck(
					formattedData,
					errorHandler,
				);

				if (result instanceof Promise) {
					return DEither.left("async-error", undefined);
				}

				if (result === DDataStructure.ErrorSymbol) {
					return DEither.left("map-error", errorHandler().createError());
				}

				return DEither.right("map-success", formattedData as never);
			},
			asyncDecodeMap: (
				self,
				...args: | [DDataStructure.Codecs, unknown]
					| [DDataStructure.Codecs]
			): any => {
				if (args.length === 1) {
					const [codecs] = args;
					return (value: never) => self.asyncDecodeMap(codecs, value);
				}
				return DCommon.justExec(async() => {
					const errorHandler = DDataStructure.createGetErrorHandler();
					const [codecs, data] = args;

					const result = await self.executeDecode(
						codecs.context.value,
						DObject.isSimple(data)
							? {
								...data,
								[entityKind.runTimeKey]: name,
							}
							: data,
						errorHandler,
					);

					if (result === DDataStructure.ErrorSymbol) {
						return DEither.left("map-error", errorHandler().createError());
					}

					return DEither.right("map-success", result as never);
				});
			},
			asyncMap: (
				self,
				data,
			): any => DCommon.justExec(async() => {
				const errorHandler = DDataStructure.createGetErrorHandler();

				const formattedData = DObject.isSimple(data)
					? {
						...data,
						[entityKind.runTimeKey]: name,
					}
					: data;

				const result = await self.executeCheck(
					formattedData,
					errorHandler,
				);

				if (result === DDataStructure.ErrorSymbol) {
					return DEither.left("map-error", errorHandler().createError());
				}

				return DEither.right("map-success", formattedData as never);
			}),
		},
	) as never,
);
