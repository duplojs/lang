import { describe, expect, it } from "vitest";
import { DS, DEither, type DCommon, type DKind, type ExpectType } from "@scripts";

describe("RecordStructure", () => {
	it("checks string keyed records and narrows with is", async() => {
		const structure = DS.RecordStructure(
			DS.TypeStructure(DS.StringType(), []),
			DS.TypeStructure(DS.NumberType(), []),
			[],
		);
		const input: unknown = {
			first: 1,
			second: 2,
		};
		const success = structure.check(input);
		const asyncSuccess = await structure.asyncCheck(input);

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			Partial<{ readonly [Prop in string]: number }>,
			"strict"
		>;
		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<"check-success", Partial<{ readonly [Prop in string]: number }>>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"check-error", DS.Error>,
			"strict"
		>;
		type _CheckAsyncSuccess = ExpectType<
			typeof asyncSuccess,
			| DEither.Right<"check-success", Partial<{ readonly [Prop in string]: number }>>
			| DEither.Left<"check-error", DS.Error>,
			"strict"
		>;

		expect(success).toStrictEqual(DEither.right("check-success", input));
		expect(asyncSuccess).toStrictEqual(DEither.right("check-success", input));
		expect(structure.is(input)).toBe(true);
		if (structure.is(input)) {
			type _CheckNarrowedInput = ExpectType<
				typeof input,
				Partial<{ readonly [Prop in string]: number }>,
				"strict"
			>;
		}
	});

	it("checks literal key records and exposes required keys in the output type", () => {
		const structure = DS.RecordStructure(
			DS.UnionStructure([
				DS.TypeStructure(DS.StringLiteralType("name"), []),
				DS.TypeStructure(DS.StringLiteralType("role"), []),
			], []),
			DS.TypeStructure(DS.StringType(), []),
			[],
		);
		const input = {
			name: "Jane",
			role: "admin",
		};

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			{
				readonly name: string;
				readonly role: string;
			},
			"strict"
		>;

		expect(structure.definition.requiredKeys).toStrictEqual(["name", "role"]);
		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(structure.is(input)).toBe(true);
	});

	it("keeps required keys open when a key union contains the string type", () => {
		const structure = DS.RecordStructure(
			DS.UnionStructure([
				DS.TypeStructure(DS.StringLiteralType("name"), []),
				DS.TypeStructure(DS.StringType(), []),
			], []),
			DS.TypeStructure(DS.StringType(), []),
			[],
		);
		const input = {
			name: "Jane",
			extra: "value",
		};

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			Partial<{ readonly [Prop in string]: string }>,
			"strict"
		>;

		expect(structure.definition.requiredKeys).toBeNull();
		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
	});

	it("allows partial literal key records when the value structure accepts undefined", () => {
		const structure = DS.RecordStructure(
			DS.TypeStructure(DS.StringLiteralType("deletedAt"), []),
			DS.TypeStructure(DS.UndefinedType(), []),
			[],
		);
		const input = {};

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			{
				readonly deletedAt?: undefined;
			},
			"strict"
		>;

		expect(structure.definition.requiredKeys).toStrictEqual(["deletedAt"]);
		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
	});

	it("returns check errors for invalid records, keys and values", () => {
		const structure = DS.RecordStructure(
			DS.UnionStructure([
				DS.TypeStructure(DS.StringLiteralType("name"), []),
				DS.TypeStructure(DS.StringLiteralType("role"), []),
			], []),
			DS.TypeStructure(DS.StringType(), []),
			[],
		);
		const invalidKind = structure.check(null);
		const invalidUnknownKey = structure.check({
			name: "Jane",
			role: "admin",
			extra: "value",
		});
		const invalidMissingValue = structure.check({
			name: "Jane",
		});
		const invalidValue = structure.check({
			name: "Jane",
			role: 123,
		});

		expect(
			DEither.unwrapByInformationOrThrow(invalidKind, "check-error").issues[0],
		).toMatchObject({
			data: null,
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidUnknownKey,
				"check-error",
			).issues[0],
		).toMatchObject({
			data: {
				name: "Jane",
				role: "admin",
				extra: "value",
			},
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidMissingValue,
				"check-error",
			).issues[0],
		).toMatchObject({
			data: undefined,
			path: "{record value: role}",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidValue,
				"check-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "{record value: role}",
		});
		expect(structure.check(new Date())).toStrictEqual(
			DEither.left("check-error", expect.anything()),
		);
		expect(structure.check({
			name: "Jane",
			role: "admin",
			[Symbol("private")]: true,
		})).toStrictEqual(DEither.left("check-error", expect.anything()));
		expect(structure.is({
			name: "Jane",
			role: 123,
		})).toBe(false);
		expect(structure.is(null)).toBe(false);
	});

	it("encodes and decodes record values with matching codecs", async() => {
		const structure = DS.RecordStructure(
			DS.UnionStructure([
				DS.TypeStructure(DS.StringLiteralType("first"), []),
				DS.TypeStructure(DS.StringLiteralType("second"), []),
			], []),
			DS.TypeStructure(DS.StringType(), []),
			[],
		);
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(data) => `name-${data}`,
		);
		const encoded = structure.encode({ codec }, {
			first: "Jane",
			second: "John",
		});
		const asyncEncoded = await structure.asyncEncode({ codec }, {
			first: "Jane",
			second: "John",
		});
		const decoded = structure.decode({ codec }, {
			first: 4,
			second: 5,
		});
		const asyncDecoded = await structure.asyncDecode({ codec }, {
			first: 4,
			second: 5,
		});

		type EncodedRecord = DS.EncodedValue<
			DS.StructureValue<typeof structure>,
			typeof codec
		>;
		type _CheckEncodedRecord = ExpectType<
			EncodedRecord,
			{
				readonly first: number;
				readonly second: number;
			},
			"strict"
		>;
		type _CheckEncoded = ExpectType<
			typeof encoded,
			| DEither.Right<
				"encode-success",
				EncodedRecord
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"encode-error", DS.Error>,
			"strict"
		>;
		type _CheckAsyncEncoded = ExpectType<
			typeof asyncEncoded,
			| DEither.Right<
				"encode-success",
				EncodedRecord
			>
			| DEither.Left<"encode-error", DS.Error>,
			"strict"
		>;
		type _CheckDecoded = ExpectType<
			typeof decoded,
			| DEither.Right<
				"decode-success",
				{
					readonly first: string;
					readonly second: string;
				}
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"decode-error", DS.Error>,
			"strict"
		>;
		type _CheckAsyncDecoded = ExpectType<
			typeof asyncDecoded,
			| DEither.Right<
				"decode-success",
				{
					readonly first: string;
					readonly second: string;
				}
			>
			| DEither.Left<"decode-error", DS.Error>,
			"strict"
		>;

		expect(encoded).toStrictEqual(DEither.right("encode-success", {
			first: 4,
			second: 4,
		}));
		expect(asyncEncoded).toStrictEqual(DEither.right("encode-success", {
			first: 4,
			second: 4,
		}));
		expect(decoded).toStrictEqual(DEither.right("decode-success", {
			first: "name-4",
			second: "name-5",
		}));
		expect(asyncDecoded).toStrictEqual(DEither.right("decode-success", {
			first: "name-4",
			second: "name-5",
		}));
	});

	it("returns encode and decode errors for invalid records or invalid values", () => {
		const structure = DS.RecordStructure(
			DS.TypeStructure(DS.StringLiteralType("name"), []),
			DS.TypeStructure(DS.StringType(), []),
			[],
		);
		const invalidEncodeKind = structure.encode({}, null as never);
		const invalidEncodeKey = structure.encode({}, {
			name: "Jane",
			extra: "value",
		} as never);
		const invalidEncodeValue = structure.encode({}, {
			name: 123,
		} as never);
		const invalidDecodeKind = structure.decode({}, null as never);
		const invalidDecodeKey = structure.decode({}, {
			name: "Jane",
			extra: "value",
		} as never);
		const invalidDecodeValue = structure.decode({}, {
			name: 123,
		} as never);

		expect(
			DEither.unwrapByInformationOrThrow(
				invalidEncodeKind,
				"encode-error",
			).issues[0],
		).toMatchObject({
			data: null,
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidEncodeKey,
				"encode-error",
			).issues[0],
		).toMatchObject({
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidEncodeValue,
				"encode-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "{record value: name}",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidDecodeKind,
				"decode-error",
			).issues[0],
		).toMatchObject({
			data: null,
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidDecodeKey,
				"decode-error",
			).issues[0],
		).toMatchObject({
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidDecodeValue,
				"decode-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "{record value: name}",
		});
	});

	it("returns async errors for asynchronous key or value structures in synchronous APIs", () => {
		const asyncTypeKind = DS.createKind("test-public-async-record-type");

		interface AsyncType extends DCommon.UnionToIntersection<
			& DS.Type<DS.TheString>
			& DKind.Kind<typeof asyncTypeKind>
		> {}

		const AsyncType = DS.createType(
			DS.TheString,
			asyncTypeKind,
			({ init }) => () => init<AsyncType>(
				{},
				{
					executeCheck: () => Promise.resolve(DS.SuccessSymbol),
					isAsynchronous: () => true,
				},
			),
		);
		const structure = DS.RecordStructure(
			DS.TypeStructure(DS.StringType(), []),
			DS.TypeStructure(AsyncType(), []),
			[],
		);

		expect(structure.isAsynchronous()).toBe(true);
		expect(structure.check({ name: "Jane" })).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(structure.encode({}, { name: "Jane" })).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(structure.decode({}, { name: "Jane" })).toStrictEqual(
			DEither.left("async-error", undefined),
		);
	});
});
