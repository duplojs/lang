import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { type FundamentalTypeValue, type FundamentalType } from "../fundamentalType";
import { type StructureValue, type Structure } from "../structure";
import { createKind } from "../kind";
import { type GetErrorHandler } from "./error";
import { ErrorSymbol } from "./resultSymbol";
import { type DObject } from "@scripts";

export const codecKind = createKind("codec");

export interface Codec<
	GenericFundamentalType extends FundamentalType = FundamentalType,
	GenericEncodedValue extends unknown = unknown,
> extends DKind.Kind<typeof codecKind> {
	fundamentalType: GenericFundamentalType;
	predicateEncode(
		input: unknown,
		errorHandler?: GetErrorHandler
	): input is GenericEncodedValue;
	encode(
		data: FundamentalTypeValue<GenericFundamentalType>,
		errorHandler?: GetErrorHandler
	): DCommon.MaybePromise<
		| GenericEncodedValue
		| ErrorSymbol
	>;
	decode(
		data: GenericEncodedValue,
		errorHandler?: GetErrorHandler
	): DCommon.MaybePromise<
		| FundamentalTypeValue<GenericFundamentalType>
		| ErrorSymbol
	>;
}

export type CodecContext = Map<FundamentalType, Codec>;

export function createCodec<
	GenericFundamentalType extends FundamentalType = FundamentalType,
	GenericEncodedValue extends unknown = unknown,
>(
	fundamentalType: GenericFundamentalType,
	predicateEncode: (
		input: unknown,
		errorHandler?: GetErrorHandler,
	) => input is GenericEncodedValue,
	encode: (
		data: FundamentalTypeValue<GenericFundamentalType>,
		errorHandler?: GetErrorHandler,
	) => DCommon.MaybePromise<
		| GenericEncodedValue
		| ErrorSymbol
	>,
	decode: (
		data: GenericEncodedValue,
		errorHandler?: GetErrorHandler,
	) => DCommon.MaybePromise<
		| FundamentalTypeValue<GenericFundamentalType>
		| ErrorSymbol
	>,
): Codec<
	GenericFundamentalType,
	GenericEncodedValue
> {
	const self: DKind.Remove<Codec> = {
		fundamentalType,
		predicateEncode,
		encode: (
			data,
			errorHandler,
		) => errorHandler?.().setCurrentContext("encode") ?? DCommon.callThen(
			encode(data as never, errorHandler),
			(encodedData) => encodedData === ErrorSymbol
				? ErrorSymbol
				: DCommon.callThen(
					predicateEncode(encodedData, errorHandler),
					(result) => errorHandler?.().setCurrentContext("default") ?? (
						result === false
							? ErrorSymbol
							: encodedData
					),
				),

		),
		decode: (
			data,
			errorHandler,
		) => errorHandler?.().setCurrentContext("decode") ?? DCommon.callThen(
			predicateEncode(data, errorHandler),
			(result) => result === false
				? ErrorSymbol
				: DCommon.callThen(
					decode(data as never, errorHandler),
					(result) => errorHandler?.().setCurrentContext("default") ?? result,
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

// Recursive types can be problematic here.
// When recursive types are used to create constraints,
// the encode/decode layer can break when it relies on
// patterns like this:
// V extends infer T ? T : never
// This forces type rendering and can trigger recursion issues.
// Some object manipulations and transformations can also cause problems.

type TreatValue<
	GenericEncodedStructure extends unknown,
	GenericValue extends unknown,
	GenericCodec extends Codec,
> = DCommon.IsNever<GenericEncodedStructure> extends true
	? DCommon.NeverCoalescing<
		GenericCodec extends Codec<
			infer InferredFundamentalType,
			infer InferredEncodedValue
		>
			? GenericValue extends FundamentalTypeValue<InferredFundamentalType>
				? InferredEncodedValue
				: never
			: never,
		GenericValue
	>
	: GenericEncodedStructure;

export type EncodedValue<
	GenericValue extends unknown,
	GenericCodec extends Codec,
> = GenericValue extends unknown
	? TreatValue<
		DObject.Values<
			EncodeStructure<GenericValue, GenericCodec>
		>,
		GenericValue,
		GenericCodec
	>
	: never;
