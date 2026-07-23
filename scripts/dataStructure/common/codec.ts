import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { type FundamentalTypeValue, type FundamentalType } from "../fundamentalType";
import { type StructureValue, type Structure } from "../structure";
import { createKind } from "../kind";
import { type NeverCoalescing } from "@scripts/common";
import { ErrorSymbol, type GetErrorHandler } from ".";

export const codecKind = createKind("codec");

export interface Codec<
	GenericFundamentalType extends FundamentalType = FundamentalType,
	GenericEncodedStructure extends Structure = Structure,
> extends DKind.Kind<typeof codecKind> {
	fundamentalType: GenericFundamentalType;
	encodedStructure: GenericEncodedStructure;
	encode(
		data: FundamentalTypeValue<GenericFundamentalType>,
		errorHandler?: GetErrorHandler
	): DCommon.MaybePromise<
		| StructureValue<GenericEncodedStructure>
		| ErrorSymbol
	>;
	decode(
		data: StructureValue<GenericEncodedStructure>,
		errorHandler?: GetErrorHandler
	): DCommon.MaybePromise<
		| FundamentalTypeValue<GenericFundamentalType>
		| ErrorSymbol
	>;
}

export type CodecContext = Map<FundamentalType, Codec>;

export function createCodec<
	GenericFundamentalType extends FundamentalType = FundamentalType,
	GenericEncodedStructure extends Structure = Structure,
>(
	fundamentalType: GenericFundamentalType,
	encodedStructure: GenericEncodedStructure,
	encode: (
		data: FundamentalTypeValue<GenericFundamentalType>,
		errorHandler?: GetErrorHandler,
	) => DCommon.MaybePromise<
		| StructureValue<GenericEncodedStructure>
		| ErrorSymbol
	>,
	decode: (
		data: StructureValue<GenericEncodedStructure>,
		errorHandler?: GetErrorHandler,
	) => DCommon.MaybePromise<
		| FundamentalTypeValue<GenericFundamentalType>
		| ErrorSymbol
	>,
): Codec<
	GenericFundamentalType,
	GenericEncodedStructure
> {
	const self: DKind.Remove<Codec> = {
		fundamentalType,
		encodedStructure,
		encode: (
			data,
			errorHandler,
		) => errorHandler?.().setCurrentContext("encode") ?? DCommon.callThen(
			encode(data as never, errorHandler),
			(encodedData) => encodedData === ErrorSymbol
				? ErrorSymbol
				: DCommon.callThen(
					encodedStructure.executeCheck(encodedData, errorHandler),
					(result) => errorHandler?.().setCurrentContext("default") ?? (
						result === ErrorSymbol
							? ErrorSymbol
							: encodedData
					),
				),

		),
		decode: (
			data,
			errorHandler,
		) => errorHandler?.().setCurrentContext("decode") ?? DCommon.callThen(
			encodedStructure.executeCheck(data, errorHandler),
			(result) => errorHandler?.().setCurrentContext("default") ?? (
				result === ErrorSymbol
					? ErrorSymbol
					: decode(data as never, errorHandler)
			),
		),
		[codecKind.runTimeKey]: null,
	};

	return self as never;
}

export interface EncodeStructure<
	GenericValue extends unknown,
	GenericCodec extends Codec,
> {

}

export type EncodedValue<
	GenericValue extends unknown,
	GenericCodec extends Codec,
> = GenericValue extends unknown
	? (
		EncodeStructure<
			GenericValue,
			GenericCodec
		> extends infer InferredResult
			? InferredResult[keyof InferredResult]
			: never
	) extends infer InferredResult
		? DCommon.IsNever<InferredResult> extends true
			? NeverCoalescing<
				GenericCodec extends Codec<
					infer InferredFundamentalType,
					infer InferredEncodedStructure
				>
					? GenericValue extends FundamentalTypeValue<InferredFundamentalType>
						? StructureValue<InferredEncodedStructure>
						: never
					: never,
				GenericValue
			>
			: InferredResult
		: never
	: never;
