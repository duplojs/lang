import { DDataStructure, DEither, DModeling, type ExpectType } from "@scripts";

describe("EntityNameStructure", () => {
	it("creates a named structure for the entity name literal", () => {
		const structure = DModeling.EntityNameStructure("user");

		type _CheckStructure = ExpectType<
			typeof structure,
			DModeling.EntityNameStructure,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			unknown,
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
				unknown,
				"strict"
			>;
		}
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
