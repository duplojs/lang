import { DDataStructure, type ExpectType } from "@scripts";

describe("codec", () => {
	it("creates a codec kind with its fundamental type and encoded structure", () => {
		const encodedStructure = DDataStructure.TypeStructure(DDataStructure.NumberType(), []);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			encodedStructure.is,
			(data) => data.length,
			(data) => `value-${data}`,
		);

		type _CheckCodec = ExpectType<
			typeof codec,
			DDataStructure.Codec<
				typeof DDataStructure.TheString,
				DDataStructure.StructureValue<typeof encodedStructure>
			>,
			"strict"
		>;

		expect(DDataStructure.codecKind.has(codec)).toBe(true);
		expect(codec.fundamentalType).toBe(DDataStructure.TheString);
		expect(codec.predicateEncode).toBe(encodedStructure.is);
	});

	it("encodes and validates encoded data", () => {
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => `value-${data}`,
		);

		expect(codec.encode("abcd")).toBe(4);
	});

	it("returns encode errors from the encoder", () => {
		const getErrorHandler = DDataStructure.createGetErrorHandler();
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(_data, errorHandler) => {
				errorHandler?.().addIssue(DDataStructure.TheString, "encode-error");
				return DDataStructure.ErrorSymbol;
			},
			(data) => `value-${data}`,
		);

		expect(codec.encode("abcd", getErrorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(getErrorHandler().issues[0]).toMatchObject({
			context: "encode",
			data: "encode-error",
		});
	});

	it("returns encode errors when encoded data does not match the encoded structure", () => {
		const getErrorHandler = DDataStructure.createGetErrorHandler();
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			() => "invalid" as never,
			(data) => `value-${data}`,
		);

		expect(codec.encode("abcd", getErrorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(getErrorHandler().issues[0]).toMatchObject({
			context: "encode",
			data: "invalid",
		});
	});

	it("decodes checked encoded data", () => {
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => `value-${data}`,
		);

		expect(codec.decode(4)).toBe("value-4");
	});

	it("returns decode errors when encoded data does not match the encoded structure", () => {
		const getErrorHandler = DDataStructure.createGetErrorHandler();
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => `value-${data}`,
		);

		expect(codec.decode("invalid" as never, getErrorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(getErrorHandler().issues[0]).toMatchObject({
			context: "decode",
			data: "invalid",
		});
	});

	it("returns decode errors from the decoder", () => {
		const getErrorHandler = DDataStructure.createGetErrorHandler();
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(_data, errorHandler) => {
				errorHandler?.().addIssue(DDataStructure.TheString, "decode-error");
				return DDataStructure.ErrorSymbol;
			},
		);

		expect(codec.decode(4, getErrorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(getErrorHandler().issues[0]).toMatchObject({
			context: "decode",
			data: "decode-error",
		});
	});

	it("supports asynchronous encoders and decoders", async() => {
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => Promise.resolve(data.length),
			(data) => Promise.resolve(`value-${data}`),
		);

		await expect(codec.encode("abcd")).resolves.toBe(4);
		await expect(codec.decode(4)).resolves.toBe("value-4");
	});

	it("infers encoded values for matching codecs and falls back otherwise", () => {
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => `value-${data}`,
		);

		type _CheckEncodedValue = ExpectType<
			DDataStructure.EncodedValue<string, typeof codec>,
			number,
			"strict"
		>;
		type _CheckFallbackValue = ExpectType<
			DDataStructure.EncodedValue<boolean, typeof codec>,
			boolean,
			"strict"
		>;

		expect(codec.encode("abcd")).toBe(4);
	});
});
