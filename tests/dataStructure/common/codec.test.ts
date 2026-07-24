import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("codec", () => {
	it("creates a codec kind with its fundamental type and encoded structure", () => {
		const encodedStructure = DS.TypeStructure(DS.NumberType(), []);
		const codec = DS.createCodec(
			DS.TheString,
			encodedStructure,
			(data) => data.length,
			(data) => `value-${data}`,
		);

		type _CheckCodec = ExpectType<
			typeof codec,
			DS.Codec<typeof DS.TheString, typeof encodedStructure>,
			"strict"
		>;

		expect(DS.codecKind.has(codec)).toBe(true);
		expect(codec.fundamentalType).toBe(DS.TheString);
		expect(codec.encodedStructure).toBe(encodedStructure);
	});

	it("encodes and validates encoded data", () => {
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(data) => `value-${data}`,
		);

		expect(codec.encode("abcd")).toBe(4);
	});

	it("returns encode errors from the encoder", () => {
		const getErrorHandler = DS.createGetErrorHandler();
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(_data, errorHandler) => {
				errorHandler?.().addIssue(DS.TheString, "encode-error");
				return DS.ErrorSymbol;
			},
			(data) => `value-${data}`,
		);

		expect(codec.encode("abcd", getErrorHandler)).toBe(DS.ErrorSymbol);
		expect(getErrorHandler().issues[0]).toMatchObject({
			context: "encode",
			data: "encode-error",
		});
	});

	it("returns encode errors when encoded data does not match the encoded structure", () => {
		const getErrorHandler = DS.createGetErrorHandler();
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			() => "invalid" as never,
			(data) => `value-${data}`,
		);

		expect(codec.encode("abcd", getErrorHandler)).toBe(DS.ErrorSymbol);
		expect(getErrorHandler().issues[0]).toMatchObject({
			context: "encode",
			data: "invalid",
		});
	});

	it("decodes checked encoded data", () => {
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(data) => `value-${data}`,
		);

		expect(codec.decode(4)).toBe("value-4");
	});

	it("returns decode errors when encoded data does not match the encoded structure", () => {
		const getErrorHandler = DS.createGetErrorHandler();
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(data) => `value-${data}`,
		);

		expect(codec.decode("invalid" as never, getErrorHandler)).toBe(DS.ErrorSymbol);
		expect(getErrorHandler().issues[0]).toMatchObject({
			context: "decode",
			data: "invalid",
		});
	});

	it("returns decode errors from the decoder", () => {
		const getErrorHandler = DS.createGetErrorHandler();
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(_data, errorHandler) => {
				errorHandler?.().addIssue(DS.TheString, "decode-error");
				return DS.ErrorSymbol;
			},
		);

		expect(codec.decode(4, getErrorHandler)).toBe(DS.ErrorSymbol);
		expect(getErrorHandler().issues[0]).toMatchObject({
			context: "decode",
			data: "decode-error",
		});
	});

	it("supports asynchronous encoders and decoders", async() => {
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => Promise.resolve(data.length),
			(data) => Promise.resolve(`value-${data}`),
		);

		await expect(codec.encode("abcd")).resolves.toBe(4);
		await expect(codec.decode(4)).resolves.toBe("value-4");
	});

	it("infers encoded values for matching codecs and falls back otherwise", () => {
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(data) => `value-${data}`,
		);

		type _CheckEncodedValue = ExpectType<
			DS.EncodedValue<string, typeof codec>,
			number,
			"strict"
		>;
		type _CheckFallbackValue = ExpectType<
			DS.EncodedValue<boolean, typeof codec>,
			boolean,
			"strict"
		>;

		expect(codec.encode("abcd")).toBe(4);
	});
});
