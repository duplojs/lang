import type * as DKind from "@scripts/kind";
import * as DEither from "@scripts/either";
import * as DCommon from "@scripts/common";
import { type FundamentalType } from "../fundamentalType";
import { createKind } from "../kind";
import { ErrorSymbol, SuccessSymbol } from "../common";
import { type ConstraintValue, type Constraint } from "../constraint";
import { type EncodedValue, type Codec, type CodecContext } from "../codec";
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
	executeCheck(data: unknown): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	executeConstraints(data: unknown): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
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
	executeEncode(
		codecContext: CodecContext,
		data: unknown,
	): unknown;
	executeDecode(
		codecContext: CodecContext,
		data: unknown,
	): unknown;
	isAsynchronous(): boolean;
	check(data: unknown): (
		| DEither.Right<"check-success", StructureValue<this>>
		| DEither.Left<"check-error", undefined>
	);
	asyncCheck(data: unknown): Promise<
		| DEither.Right<"check-success", StructureValue<this>>
		| DEither.Left<"check-error", undefined>
	>;
	is(data: unknown): data is StructureValue<this>;
	encode<
		GenericCodecs extends DCommon.AnyTuple<Codec>,
	>(
		codecs: GenericCodecs,
		data: StructureValue<this>,
	): (
		| DEither.Right<
			"encode-success",
			EncodedValue<StructureValue<this>, GenericCodecs[number]>
		>
		| DEither.Left<"encode-error", undefined>
	);
	asyncEncode<
		GenericCodecs extends DCommon.AnyTuple<Codec>,
	>(
		codecs: GenericCodecs,
		data: StructureValue<this>,
	): Promise<
		| DEither.Right<
			"encode-success",
			EncodedValue<StructureValue<this>, GenericCodecs[number]>
		>
		| DEither.Left<"encode-error", undefined>
	>;
	unsafeEncode<
		GenericCodecs extends DCommon.AnyTuple<Codec>,
	>(
		codecs: GenericCodecs,
		data: unknown,
	): (
		| DEither.Right<
			"encode-success",
			EncodedValue<StructureValue<this>, GenericCodecs[number]>
		>
		| DEither.Left<"encode-error", undefined>
	);
	asyncUnsafeEncode<
		GenericCodecs extends DCommon.AnyTuple<Codec>,
	>(
		codecs: GenericCodecs,
		data: unknown,
	): Promise<
		| DEither.Right<
			"encode-success",
			EncodedValue<StructureValue<this>, GenericCodecs[number]>
		>
		| DEither.Left<"encode-error", undefined>
	>;
	decode<
		GenericCodecs extends DCommon.AnyTuple<Codec>,
	>(
		codecs: GenericCodecs,
		data: EncodedValue<StructureValue<this>, GenericCodecs[number]>,
	): (
		| DEither.Right<
			"decode-success",
			StructureValue<this>
		>
		| DEither.Left<"decode-error", undefined>
	);
	asyncDecode<
		GenericCodecs extends DCommon.AnyTuple<Codec>,
	>(
		codecs: GenericCodecs,
		data: EncodedValue<StructureValue<this>, GenericCodecs[number]>,
	): Promise<
		| DEither.Right<
			"decode-success",
			StructureValue<this>
		>
		| DEither.Left<"decode-error", undefined>
	>;
	unsafeDecode(
		codecs: DCommon.AnyTuple<Codec>,
		data: unknown,
	): (
		| DEither.Right<
			"decode-success",
			StructureValue<this>
		>
		| DEither.Left<"decode-error", undefined>
	);
	asyncUnsafeDecode(
		codecs: DCommon.AnyTuple<Codec>,
		data: unknown,
	): Promise<
		| DEither.Right<
			"decode-success",
			StructureValue<this>
		>
		| DEither.Left<"decode-error", undefined>
	>;
}

export interface CreateStructureInitParams<
	GenericStructure extends Structure = Structure,
> {
	executeCheck(
		self: GenericStructure,
		data: unknown,
	): DCommon.MaybePromise<
			| SuccessSymbol
			| ErrorSymbol
	>;
	executeEncode(
		self: GenericStructure,
		codecContext: CodecContext,
		data: unknown,
	): unknown;
	executeDecode(
		self: GenericStructure,
		codecContext: CodecContext,
		data: unknown,
	): unknown;
	isAsynchronous(self: GenericStructure): boolean;
}

export interface CreateStructureConstructorParams<
	GenericKindHandler extends DKind.Handler = DKind.Handler,
> {
	init<
		GenericStructure extends (
			& Structure<any>
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
			& Structure<any>
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
			executeConstraints: (data) => definition.constraints.reduce<
				DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>
			>(
				(accumulator, constraint) => DCommon.callThen(
					accumulator,
					(result) => result === ErrorSymbol
						? ErrorSymbol
						: constraint.executeCheck(data),
				),
				SuccessSymbol,
			),
			executeCheck: (data) => DCommon.callThen(
				executeCheck(self as never, data),
				(result) => result === ErrorSymbol
					? ErrorSymbol
					: self.executeConstraints(data),
			),
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
			executeEncode: (codecContext, data) => executeEncode(
				self as never,
				codecContext,
				data,
			),
			executeDecode: (codecContext, data) => executeDecode(
				self as never,
				codecContext,
				data,
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
				const result = self.executeCheck(data);
				if (result instanceof Promise || result === ErrorSymbol) {
					return DEither.left("check-error", undefined);
				}

				return DEither.right("check-success", data);
			},
			asyncCheck: async(data) => {
				const result = await self.executeCheck(data);
				if (result === ErrorSymbol) {
					return DEither.left("check-error", undefined);
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
				const result = self.executeEncode(
					new Map<FundamentalType, Codec>(
						codecs.map(
							(codec) => [codec.fundamentalType, codec],
						),
					),
					data,
				);

				if (result instanceof Promise || result === ErrorSymbol) {
					return DEither.left("encode-error", undefined);
				}

				return DEither.right("encode-success", result as never);
			},
			asyncUnsafeEncode: async(codecs, data) => {
				const result = await self.executeEncode(
					new Map<FundamentalType, Codec>(
						codecs.map(
							(codec) => [codec.fundamentalType, codec],
						),
					),
					data,
				);

				if (result === ErrorSymbol) {
					return DEither.left("encode-error", undefined);
				}

				return DEither.right("encode-success", result as never);
			},
			decode: (codecs, data) => self.unsafeDecode(codecs, data),
			asyncDecode: (codecs, data) => self.asyncUnsafeDecode(codecs, data),
			unsafeDecode: (codecs, data) => {
				const result = self.executeDecode(
					new Map<FundamentalType, Codec>(
						codecs.map(
							(codec) => [codec.fundamentalType, codec],
						),
					),
					data,
				);

				if (result instanceof Promise || result === ErrorSymbol) {
					return DEither.left("decode-error", undefined);
				}

				return DEither.right("decode-success", result as never);
			},
			asyncUnsafeDecode: async(codecs, data) => {
				const result = await self.executeDecode(
					new Map<FundamentalType, Codec>(
						codecs.map(
							(codec) => [codec.fundamentalType, codec],
						),
					),
					data,
				);

				if (result === ErrorSymbol) {
					return DEither.left("decode-error", undefined);
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
