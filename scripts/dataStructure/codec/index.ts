import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { type FundamentalTypeValue, type FundamentalType } from "../fundamentalType";
import { type StructureValue, type Structure } from "../structure";
import { createKind } from "../kind";
import { type UnionToIntersection, type NeverCoalescing } from "@scripts/common";
import { ErrorSymbol } from "../common";

export const codecKind = createKind("codec");

export interface Codec<
	GenericFundamentalType extends FundamentalType = FundamentalType,
	GenericEncodedStructure extends Structure = Structure,
> extends DKind.Kind<typeof codecKind> {
	fundamentalType: GenericFundamentalType;
	encodedStructure: GenericEncodedStructure;
	encode(data: FundamentalTypeValue<GenericFundamentalType>): DCommon.MaybePromise<
		| StructureValue<GenericEncodedStructure>
		| ErrorSymbol
	>;
	decode(data: StructureValue<GenericEncodedStructure>): DCommon.MaybePromise<
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
		data: GenericFundamentalType,
	) => DCommon.MaybePromise<
		| StructureValue<GenericEncodedStructure>
		| ErrorSymbol
	>,
	decode: (
		data: StructureValue<GenericEncodedStructure>,
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
		encode: (data) => DCommon.callThen(
			encode(data as never),
			(encodedData) => encodedData === ErrorSymbol
				? ErrorSymbol
				: DCommon.callThen(
					encodedStructure.executeCheck(encodedData),
					(result) => result === ErrorSymbol
						? ErrorSymbol
						: encodedData,
				),

		),
		decode: (data) => DCommon.callThen(
			encodedStructure.executeCheck(data),
			(result) => result === ErrorSymbol
				? ErrorSymbol
				: decode(data as never),
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
	? NeverCoalescing<
		EncodeStructure<
			GenericValue,
			GenericCodec
		> extends infer InferredResult
			? InferredResult[keyof InferredResult]
			: never,
		GenericValue
	> extends infer InferredResult
		? NeverCoalescing<
			UnionToIntersection<
				GenericCodec extends Codec<
					infer InferredFundamentalType,
					infer InferredEncodedStructure
				>
					? InferredResult extends FundamentalTypeValue<InferredFundamentalType>
						? StructureValue<InferredEncodedStructure>
						: never
					: never
			>,
			InferredResult
		>
		: never
	: never;
