import { DDataStructure, DEither, DModeling, type ExpectType } from "@scripts";

describe("EntityNameStructure", () => {
	it("creates a named structure for the entity name literal", () => {
		const structure = DModeling.EntityNameStructure("user");

		type _CheckStructure = ExpectType<
			typeof structure,
			DModeling.EntityNameStructure<"user">,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			"user",
			"strict"
		>;

		expect(DModeling.entityNameStructureKind.has(structure)).toBe(true);
		expect(structure.name).toBe("user");
		expect(structure.isAsynchronous()).toBe(false);
	});

	it("checks only the matching entity name", async() => {
		const structure = DModeling.EntityNameStructure("user");
		const input: unknown = "user";

		expect(structure.executeCheck("user")).toBe(DDataStructure.SuccessSymbol);
		expect(structure.executeCheck("organization")).toBe(DDataStructure.ErrorSymbol);
		expect(structure.check("user")).toStrictEqual(
			DEither.right("check-success", "user"),
		);
		expect(await structure.asyncCheck("user")).toStrictEqual(
			DEither.right("check-success", "user"),
		);
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.check("organization"),
				"check-error",
			).issues[0],
		).toMatchObject({
			data: "organization",
			path: "",
		});

		if (structure.is(input)) {
			type _CheckNarrowedInput = ExpectType<
				typeof input,
				"user",
				"strict"
			>;
		}
	});

	it("does not encode or decode the entity name through matching string codecs", async() => {
		const structure = DModeling.EntityNameStructure("user");
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			(data) => `decoded-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ codec });
		const encoded = structure.encode(codecs, "user");
		const asyncEncoded = await structure.asyncEncode(codecs, "user");
		const decoded = structure.unsafeDecode(codecs, "user");
		const asyncDecoded = await structure.asyncUnsafeDecode(codecs, "user");
		type ExpectedEncoded = (
			| DEither.Right<"encode-success", "user">
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"encode-error", DDataStructure.Error>
		);

		// @ts-expect-error EntityNameStructure should expose its literal encoded value.
		type _CheckEncoded = ExpectType<typeof encoded, ExpectedEncoded, "strict">;
		// @ts-expect-error EntityNameStructure should decode its literal value with codecs.
		structure.decode(codecs, "user");

		expect(encoded).toStrictEqual(
			DEither.right("encode-success", "user"),
		);
		expect(asyncEncoded).toStrictEqual(
			DEither.right("encode-success", "user"),
		);
		expect(decoded).toStrictEqual(
			DEither.right("decode-success", "user"),
		);
		expect(asyncDecoded).toStrictEqual(
			DEither.right("decode-success", "user"),
		);
	});

	it("returns encode and decode errors for invalid entity names", async() => {
		const structure = DModeling.EntityNameStructure("user");
		const codecs = DDataStructure.createCodecs({});
		const encodeError = structure.unsafeEncode(codecs, "organization");
		const asyncEncodeError = await structure.asyncUnsafeEncode(codecs, "organization");
		const decodeError = structure.unsafeDecode(codecs, "organization");
		const asyncDecodeError = await structure.asyncUnsafeDecode(codecs, "organization");

		expect(
			DEither.unwrapByInformationOrThrow(
				encodeError,
				"encode-error",
			).issues[0],
		).toMatchObject({
			context: "default",
			data: "organization",
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncEncodeError,
				"encode-error",
			).issues[0],
		).toMatchObject({
			context: "default",
			data: "organization",
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				decodeError,
				"decode-error",
			).issues[0],
		).toMatchObject({
			context: "default",
			data: "organization",
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncDecodeError,
				"decode-error",
			).issues[0],
		).toMatchObject({
			context: "default",
			data: "organization",
			path: "",
		});
	});
});
