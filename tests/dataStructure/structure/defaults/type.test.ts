import { describe, expect, it } from "vitest";
import { DS, DEither, type DCommon, type DKind, type ExpectType } from "@scripts";

describe("TypeStructure", () => {
	it("checks values with the wrapped type", async() => {
		const structure = DS.TypeStructure(DS.StringType(), []);
		const success = structure.check("value");
		const failure = structure.check(123);
		const asyncSuccess = await structure.asyncCheck("value");

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			string,
			"strict"
		>;
		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<"check-success", string>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"check-error", DS.Error>,
			"strict"
		>;
		type _CheckAsyncSuccess = ExpectType<
			typeof asyncSuccess,
			| DEither.Right<"check-success", string>
			| DEither.Left<"check-error", DS.Error>,
			"strict"
		>;

		expect(success).toStrictEqual(DEither.right("check-success", "value"));
		expect(asyncSuccess).toStrictEqual(DEither.right("check-success", "value"));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: 123,
			path: "",
		});
		expect(structure.is("value")).toBe(true);
		expect(structure.is(123)).toBe(false);
	});

	it("returns async check errors for asynchronous types in synchronous APIs", async() => {
		const asyncTypeKind = DS.createKind("test-public-async-type-structure-type");

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

		const structure = DS.TypeStructure(AsyncType(), []);

		expect(structure.check("value")).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncCheck("value")).toStrictEqual(
			DEither.right("check-success", "value"),
		);
		expect(structure.is("value")).toBe(false);
		expect(structure.isAsynchronous()).toBe(true);
	});

	it("encodes values with the matching codec", async() => {
		const structure = DS.TypeStructure(DS.StringType(), []);
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(data) => `value-${data}`,
		);
		const success = structure.encode({ codec }, "abcd");
		const asyncSuccess = await structure.asyncEncode({ codec }, "abcd");
		const fallbackSuccess = structure.encode({}, "abcd");
		const failure = structure.encode({ codec }, 123 as never);

		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<"encode-success", number>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"encode-error", DS.Error>,
			"strict"
		>;
		type _CheckAsyncSuccess = ExpectType<
			typeof asyncSuccess,
			| DEither.Right<"encode-success", number>
			| DEither.Left<"encode-error", DS.Error>,
			"strict"
		>;

		expect(success).toStrictEqual(DEither.right("encode-success", 4));
		expect(asyncSuccess).toStrictEqual(DEither.right("encode-success", 4));
		expect(fallbackSuccess).toStrictEqual(
			DEither.right("encode-success", "abcd"),
		);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "encode-error").issues[0],
		).toMatchObject({
			data: 123,
			path: "",
		});
	});

	it("returns async encode errors for asynchronous encoders in synchronous APIs", async() => {
		const structure = DS.TypeStructure(DS.StringType(), []);
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => Promise.resolve(data.length),
			(data) => `value-${data}`,
		);

		expect(structure.encode({ codec }, "abcd")).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncEncode({ codec }, "abcd")).toStrictEqual(
			DEither.right("encode-success", 4),
		);
	});

	it("returns encode errors from matching codecs", async() => {
		const structure = DS.TypeStructure(DS.StringType(), []);
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(_data, errorHandler) => (
				errorHandler?.().addIssue(DS.TheString, "encoded-error") ?? DS.ErrorSymbol
			),
			(data) => `value-${data}`,
		);
		const failure = structure.encode({ codec }, "abcd");
		const asyncFailure = await structure.asyncEncode({ codec }, "abcd");

		expect(
			DEither.unwrapByInformationOrThrow(failure, "encode-error").issues[0],
		).toMatchObject({
			context: "encode",
			data: "encoded-error",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncFailure,
				"encode-error",
			).issues[0],
		).toMatchObject({
			context: "encode",
			data: "encoded-error",
		});
	});

	it("decodes values with the matching codec", async() => {
		const structure = DS.TypeStructure(DS.StringType(), []);
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(data) => `value-${data}`,
		);
		const success = structure.decode({ codec }, 4);
		const asyncSuccess = await structure.asyncDecode({ codec }, 4);
		const fallbackSuccess = structure.decode({}, "value");
		const failure = structure.decode({}, 123 as never);

		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<"decode-success", string>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"decode-error", DS.Error>,
			"strict"
		>;
		type _CheckAsyncSuccess = ExpectType<
			typeof asyncSuccess,
			| DEither.Right<"decode-success", string>
			| DEither.Left<"decode-error", DS.Error>,
			"strict"
		>;

		expect(success).toStrictEqual(DEither.right("decode-success", "value-4"));
		expect(asyncSuccess).toStrictEqual(
			DEither.right("decode-success", "value-4"),
		);
		expect(fallbackSuccess).toStrictEqual(
			DEither.right("decode-success", "value"),
		);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "decode-error").issues[0],
		).toMatchObject({
			data: 123,
			path: "",
		});
	});

	it("returns async decode errors for asynchronous decoders in synchronous APIs", async() => {
		const structure = DS.TypeStructure(DS.StringType(), []);
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(data) => Promise.resolve(`value-${data}`),
		);

		expect(structure.decode({ codec }, 4)).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncDecode({ codec }, 4)).toStrictEqual(
			DEither.right("decode-success", "value-4"),
		);
	});

	it("returns decode errors from matching codecs", async() => {
		const structure = DS.TypeStructure(DS.StringType(), []);
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(_data, errorHandler) => (
				errorHandler?.().addIssue(DS.TheString, "decoded-error") ?? DS.ErrorSymbol
			),
		);
		const failure = structure.decode({ codec }, 4);
		const asyncFailure = await structure.asyncDecode({ codec }, 4);

		expect(
			DEither.unwrapByInformationOrThrow(failure, "decode-error").issues[0],
		).toMatchObject({
			context: "decode",
			data: "decoded-error",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncFailure,
				"decode-error",
			).issues[0],
		).toMatchObject({
			context: "decode",
			data: "decoded-error",
		});
	});
});
