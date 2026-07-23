import type * as DKind from "@scripts/kind";
import * as DEither from "@scripts/either";
import * as DCommon from "@scripts/common";
import { type FundamentalType } from "../fundamentalType";
import { createKind } from "../kind";
import { createGetErrorHandler, ErrorSymbol, type GetErrorHandler, SuccessSymbol, type EncodedValue, type Codec, type CodecContext, type Error } from "../common";
import { type ConstraintValue, type Constraint } from "../constraint";
import { type StructureValue } from "./types";

export class StructureClass {
	private constructor() {}

	public static init(params: DKind.Remove<Structure>) {
		const self = new StructureClass();
		DCommon.bindPrototypeMethods(self);
		for (const key in params) {
			self[key as never] = params[key as never];
		}

		return self as Structure;
	}
}

export const structureKind = createKind("structure");

export interface StructureDefinition<
	GenericConstraints extends readonly Constraint[] = readonly Constraint[],
> {
	readonly constraints: readonly [...GenericConstraints];
}

export interface Structure<
	GenericValue extends unknown = unknown,
	GenericDefinition extends StructureDefinition<
		readonly Constraint<GenericValue>[]
	> = StructureDefinition<readonly Constraint<GenericValue>[]>,
> extends StructureClass, DKind.Kind<
		typeof structureKind,
		(
			& GenericValue
			& DCommon.UnionToIntersection<
				ConstraintValue<GenericDefinition["constraints"][number]>
			>
		)
	> {
	readonly definition: GenericDefinition;
	addConstraint<
		const GenericNewConstraints extends DCommon.AnyTuple<Constraint<GenericValue>>,
	>(
		...args: GenericNewConstraints
	): Structure<
		GenericValue,
		StructureDefinition<
			readonly [...this["definition"]["constraints"], ...GenericNewConstraints]
		>
	>;
	executeConstraints(data: unknown, errorHandler?: GetErrorHandler): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	executeCheck(data: unknown, errorHandler?: GetErrorHandler): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	executeEncode(
		codecContext: CodecContext,
		data: unknown,
		errorHandler?: GetErrorHandler
	): unknown;
	executeDecode(
		codecContext: CodecContext,
		data: unknown,
		errorHandler?: GetErrorHandler
	): unknown;
	isAsynchronous(): boolean;
	check(data: unknown): (
		| DEither.Right<"check-success", StructureValue<this>>
		| DEither.Left<"async-error", undefined>
		| DEither.Left<"check-error", Error>
	);
	asyncCheck(data: unknown): Promise<
		| DEither.Right<"check-success", StructureValue<this>>
		| DEither.Left<"check-error", Error>
	>;
	is(data: unknown): data is StructureValue<this>;
	encode<
		GenericCodecs extends Record<string, Codec>,
	>(
		codecs: GenericCodecs,
		data: StructureValue<this>,
	): (
		| DEither.Right<
			"encode-success",
			EncodedValue<StructureValue<this>, GenericCodecs[keyof GenericCodecs]>
		>
		| DEither.Left<"async-error", undefined>
		| DEither.Left<"encode-error", Error>
	);
	asyncEncode<
		GenericCodecs extends Record<string, Codec>,
	>(
		codecs: GenericCodecs,
		data: StructureValue<this>,
	): Promise<
		| DEither.Right<
			"encode-success",
			EncodedValue<StructureValue<this>, GenericCodecs[keyof GenericCodecs]>
		>
		| DEither.Left<"encode-error", Error>
	>;
	unsafeEncode<
		GenericCodecs extends Record<string, Codec>,
	>(
		codecs: GenericCodecs,
		data: unknown,
	): (
		| DEither.Right<
			"encode-success",
			EncodedValue<StructureValue<this>, GenericCodecs[keyof GenericCodecs]>
		>
		| DEither.Left<"async-error", undefined>
		| DEither.Left<"encode-error", Error>
	);
	asyncUnsafeEncode<
		GenericCodecs extends Record<string, Codec>,
	>(
		codecs: GenericCodecs,
		data: unknown,
	): Promise<
		| DEither.Right<
			"encode-success",
			EncodedValue<StructureValue<this>, GenericCodecs[keyof GenericCodecs]>
		>
		| DEither.Left<"encode-error", Error>
	>;
	decode<
		GenericCodecs extends Record<string, Codec>,
	>(
		codecs: GenericCodecs,
		data: EncodedValue<StructureValue<this>, GenericCodecs[keyof GenericCodecs]>,
	): (
		| DEither.Right<
			"decode-success",
			StructureValue<this>
		>
		| DEither.Left<"async-error", undefined>
		| DEither.Left<"decode-error", Error>
	);
	asyncDecode<
		GenericCodecs extends Record<string, Codec>,
	>(
		codecs: GenericCodecs,
		data: EncodedValue<StructureValue<this>, GenericCodecs[keyof GenericCodecs]>,
	): Promise<
		| DEither.Right<
			"decode-success",
			StructureValue<this>
		>
		| DEither.Left<"decode-error", Error>
	>;
	unsafeDecode(
		codecs: Record<string, Codec>,
		data: unknown,
	): (
		| DEither.Right<
			"decode-success",
			StructureValue<this>
		>
		| DEither.Left<"async-error", undefined>
		| DEither.Left<"decode-error", Error>
	);
	asyncUnsafeDecode(
		codecs: Record<string, Codec>,
		data: unknown,
	): Promise<
		| DEither.Right<
			"decode-success",
			StructureValue<this>
		>
		| DEither.Left<"decode-error", Error>
	>;
}

export interface CreateStructureInitParams<
	GenericStructure extends Structure = Structure,
> {
	executeCheck(
		self: GenericStructure,
		data: unknown,
		errorHandler?: GetErrorHandler,
	): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	executeEncode(
		self: GenericStructure,
		codecContext: CodecContext,
		data: unknown,
		errorHandler?: GetErrorHandler,
	): unknown;
	executeDecode(
		self: GenericStructure,
		codecContext: CodecContext,
		data: unknown,
		errorHandler?: GetErrorHandler,
	): unknown;
	isAsynchronous(self: GenericStructure): boolean;
}

export interface CreateStructureConstructorParams<
	GenericKindHandler extends DKind.Handler = DKind.Handler,
> {
	init<
		GenericStructure extends (
			& Structure
			& DKind.Kind<GenericKindHandler>
		),
	>(
		definition: GenericStructure["definition"],
		params: CreateStructureInitParams<GenericStructure>
	): GenericStructure;
}

export function createStructure<
	GenericKindHandler extends DKind.Handler,
	GenericConstructor extends (
		(...args: any[]) => (
			& Structure
			& DKind.Kind<GenericKindHandler>
		)
	),
>(
	kindHandler: GenericKindHandler,
	createConstructor: (
		params: CreateStructureConstructorParams<
			GenericKindHandler
		>,
	) => GenericConstructor,
): GenericConstructor {
	const init: CreateStructureConstructorParams["init"] = (
		definition,
		{
			executeCheck,
			executeEncode,
			executeDecode,
			isAsynchronous,
		},
	) => {
		let cachedIsAsynchronous: undefined | boolean = undefined;
		const self = StructureClass.init({
			definition,
			addConstraint: (...args) => init(
				{
					...definition,
					constraints: [
						...definition.constraints,
						...args,
					],
				},
				{
					executeCheck,
					executeEncode,
					executeDecode,
					isAsynchronous,
				},
			) as never,
			executeConstraints: (data, errorHandler) => definition.constraints.reduce<
				DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>
			>(
				(accumulator, constraint) => DCommon.callThen(
					accumulator,
					(result) => result === ErrorSymbol
						? ErrorSymbol
						: constraint.executeCheck(data, errorHandler),
				),
				SuccessSymbol,
			),
			executeCheck: (data, errorHandler) => DCommon.callThen(
				executeCheck(self as never, data, errorHandler),
				(result) => result === ErrorSymbol
					? ErrorSymbol
					: self.executeConstraints(data, errorHandler),
			),
			executeEncode: (codecContext, data, errorHandler) => executeEncode(
				self as never,
				codecContext,
				data,
				errorHandler,
			),
			executeDecode: (codecContext, data, errorHandler) => executeDecode(
				self as never,
				codecContext,
				data,
				errorHandler,
			),
			isAsynchronous: () => {
				if (cachedIsAsynchronous !== undefined) {
					return cachedIsAsynchronous;
				}
				cachedIsAsynchronous = false;
				cachedIsAsynchronous = self.definition.constraints.some(
					(value) => value.isAsynchronous(),
				);
				if (cachedIsAsynchronous) {
					return cachedIsAsynchronous;
				}
				cachedIsAsynchronous = isAsynchronous(self as never);
				return cachedIsAsynchronous;
			},
			check: (data) => {
				const errorHandler = createGetErrorHandler();
				const result = self.executeCheck(
					data,
					errorHandler,
				);

				if (result instanceof Promise) {
					return DEither.left("async-error", undefined);
				}

				if (result === ErrorSymbol) {
					return DEither.left("check-error", errorHandler().createError());
				}

				return DEither.right("check-success", data);
			},
			asyncCheck: async(data) => {
				const errorHandler = createGetErrorHandler();
				const result = await self.executeCheck(
					data,
					errorHandler,
				);
				if (result === ErrorSymbol) {
					return DEither.left("check-error", errorHandler().createError());
				}

				return DEither.right("check-success", data);
			},
			is: (data): data is never => {
				const result = self.executeCheck(data);
				if (result instanceof Promise || result === ErrorSymbol) {
					return false;
				}

				return true;
			},
			encode: (codecs, data) => self.unsafeEncode(codecs, data),
			asyncEncode: (codecs, data) => self.asyncUnsafeEncode(codecs, data),
			unsafeEncode: (codecs, data) => {
				const errorHandler = createGetErrorHandler();
				const result = self.executeEncode(
					new Map<FundamentalType, Codec>(
						Object.values(codecs).map(
							(codec) => [codec.fundamentalType, codec],
						),
					),
					data,
					errorHandler,
				);

				if (result instanceof Promise) {
					return DEither.left("async-error", undefined);
				}

				if (result === ErrorSymbol) {
					return DEither.left("encode-error", errorHandler().createError());
				}

				return DEither.right("encode-success", result as never);
			},
			asyncUnsafeEncode: async(codecs, data) => {
				const errorHandler = createGetErrorHandler();
				const result = await self.executeEncode(
					new Map<FundamentalType, Codec>(
						Object.values(codecs).map(
							(codec) => [codec.fundamentalType, codec],
						),
					),
					data,
					errorHandler,
				);

				if (result === ErrorSymbol) {
					return DEither.left("encode-error", errorHandler().createError());
				}

				return DEither.right("encode-success", result as never);
			},
			decode: (codecs, data) => self.unsafeDecode(codecs, data),
			asyncDecode: (codecs, data) => self.asyncUnsafeDecode(codecs, data),
			unsafeDecode: (codecs, data) => {
				const errorHandler = createGetErrorHandler();
				const result = self.executeDecode(
					new Map<FundamentalType, Codec>(
						Object.values(codecs).map(
							(codec) => [codec.fundamentalType, codec],
						),
					),
					data,
					errorHandler,
				);

				if (result instanceof Promise) {
					return DEither.left("async-error", undefined);
				}

				if (result === ErrorSymbol) {
					return DEither.left("decode-error", errorHandler().createError());
				}

				return DEither.right("decode-success", result as never);
			},
			asyncUnsafeDecode: async(codecs, data) => {
				const errorHandler = createGetErrorHandler();
				const result = await self.executeDecode(
					new Map<FundamentalType, Codec>(
						Object.values(codecs).map(
							(codec) => [codec.fundamentalType, codec],
						),
					),
					data,
					errorHandler,
				);

				if (result === ErrorSymbol) {
					return DEither.left("decode-error", errorHandler().createError());
				}

				return DEither.right("decode-success", result as never);
			},
			[kindHandler.runTimeKey]: null,
			[structureKind.runTimeKey]: null,
		});

		return self as never;
	};

	return createConstructor({
		init,
	});
}
