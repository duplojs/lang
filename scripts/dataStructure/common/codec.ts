import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { type FundamentalTypeValue, type FundamentalType } from "../fundamentalType";
import { type StructureValue, type Structure } from "../structure";
import { createKind } from "../kind";
import { type GetErrorHandler } from "./error";
import { ErrorSymbol } from "./resultSymbol";

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
			(result) => result === ErrorSymbol
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

type GetEncodedStructureValue<
	GenericValue extends object,
> = GenericValue[keyof GenericValue];

type TreatValue<
	GenericEncodedStructure extends unknown,
	GenericValue extends unknown,
	GenericCodec extends Codec,
> = DCommon.IsNever<GenericEncodedStructure> extends true
	? DCommon.NeverCoalescing<
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
	: GenericEncodedStructure;

export type EncodedValue<
	GenericValue extends unknown,
	GenericCodec extends Codec,
> = GenericValue extends unknown
	? TreatValue<
		GetEncodedStructureValue<
			EncodeStructure<GenericValue, GenericCodec>
		>,
		GenericValue,
		GenericCodec
	>
	: never;
