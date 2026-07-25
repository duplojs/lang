import { describe, expect, it, vi } from "vitest";
import { DS, DEither, type DCommon, type DKind, type ExpectType } from "@scripts";

describe("ArrayStructure", () => {
	it("checks arrays with homogeneous elements and narrows with is", async() => {
		const structure = DS.ArrayStructure(
			DS.TypeStructure(DS.StringType(), []),
			[],
		);
		const input: unknown = ["Jane", "John"];
		const success = structure.check(input);
		const asyncSuccess = await structure.asyncCheck(input);

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			readonly string[],
			"strict"
		>;
		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<"check-success", readonly string[]>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"check-error", DS.Error>,
			"strict"
		>;
		type _CheckAsyncSuccess = ExpectType<
			typeof asyncSuccess,
			| DEither.Right<"check-success", readonly string[]>
			| DEither.Left<"check-error", DS.Error>,
			"strict"
		>;

		expect(success).toStrictEqual(DEither.right("check-success", input));
		expect(asyncSuccess).toStrictEqual(DEither.right("check-success", input));
		expect(structure.is(input)).toBe(true);
		if (structure.is(input)) {
			type _CheckNarrowedInput = ExpectType<
				typeof input,
				readonly string[],
				"strict"
			>;
		}
	});

	it("returns check errors for invalid arrays or invalid elements", async() => {
		const structure = DS.ArrayStructure(
			DS.TypeStructure(DS.StringType(), []),
			[],
		);
		const invalidKind = structure.check(null);
		const invalidElement = structure.check(["Jane", 123]);
		const asyncInvalidElement = await structure.asyncCheck(["Jane", 123]);

		expect(
			DEither.unwrapByInformationOrThrow(invalidKind, "check-error").issues[0],
		).toMatchObject({
			data: null,
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidElement,
				"check-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "[array: 1]",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncInvalidElement,
				"check-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "[array: 1]",
		});
		expect(structure.is(["Jane", 123])).toBe(false);
		expect(structure.is([])).toBe(true);
		expect(structure.is(null)).toBe(false);
	});

	it("encodes and decodes homogeneous arrays with matching codecs", async() => {
		const structure = DS.ArrayStructure(
			DS.TypeStructure(DS.StringType(), []),
			[],
		);
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(data) => `name-${data}`,
		);
		const encoded = structure.encode({ codec }, ["Jane", "John"]);
		const asyncEncoded = await structure.asyncEncode({ codec }, ["Jane", "John"]);
		const decoded = structure.decode({ codec }, [4, 5]);
		const asyncDecoded = await structure.asyncDecode({ codec }, [4, 5]);
		const encodedValue = DEither.unwrapByInformationOrThrow(
			encoded,
			"encode-success",
		);
		const asyncEncodedValue = DEither.unwrapByInformationOrThrow(
			asyncEncoded,
			"encode-success",
		);
		const decodedValue = DEither.unwrapByInformationOrThrow(
			decoded,
			"decode-success",
		);
		const asyncDecodedValue = DEither.unwrapByInformationOrThrow(
			asyncDecoded,
			"decode-success",
		);

		type _CheckEncoded = ExpectType<
			typeof encoded,
			| DEither.Right<"encode-success", readonly number[]>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"encode-error", DS.Error>,
			"strict"
		>;
		type _CheckAsyncEncoded = ExpectType<
			typeof asyncEncoded,
			| DEither.Right<"encode-success", readonly number[]>
			| DEither.Left<"encode-error", DS.Error>,
			"strict"
		>;
		type _CheckDecoded = ExpectType<
			typeof decoded,
			| DEither.Right<"decode-success", readonly string[]>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"decode-error", DS.Error>,
			"strict"
		>;
		type _CheckAsyncDecoded = ExpectType<
			typeof asyncDecoded,
			| DEither.Right<"decode-success", readonly string[]>
			| DEither.Left<"decode-error", DS.Error>,
			"strict"
		>;
		type _CheckEncodedValue = ExpectType<
			typeof encodedValue,
			readonly number[],
			"strict"
		>;
		type _CheckAsyncEncodedValue = ExpectType<
			typeof asyncEncodedValue,
			readonly number[],
			"strict"
		>;
		type _CheckDecodedValue = ExpectType<
			typeof decodedValue,
			readonly string[],
			"strict"
		>;
		type _CheckAsyncDecodedValue = ExpectType<
			typeof asyncDecodedValue,
			readonly string[],
			"strict"
		>;

		expect(encoded).toStrictEqual(DEither.right("encode-success", [4, 4]));
		expect(asyncEncoded).toStrictEqual(DEither.right("encode-success", [4, 4]));
		expect(decoded).toStrictEqual(
			DEither.right("decode-success", ["name-4", "name-5"]),
		);
		expect(asyncDecoded).toStrictEqual(
			DEither.right("decode-success", ["name-4", "name-5"]),
		);
	});

	it("returns encode and decode errors for invalid arrays or invalid elements", () => {
		const structure = DS.ArrayStructure(
			DS.TypeStructure(DS.StringType(), []),
			[],
		);
		const invalidEncodeKind = structure.encode({}, null as never);
		const invalidEncodeElement = structure.encode({}, ["Jane", 123] as never);
		const invalidDecodeKind = structure.decode({}, null as never);
		const invalidDecodeElement = structure.decode({}, ["Jane", 123] as never);

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
				invalidEncodeElement,
				"encode-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "[array: 1]",
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
				invalidDecodeElement,
				"decode-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "[array: 1]",
		});
	});

	it("checks constraints against source data after encoding and decoded data after decoding", async() => {
		const constraintKind = DS.createKind("test-public-array-constraint");
		const executeCheck = vi.fn(
			(
				self: ArrayConstraint,
				data: readonly string[],
				errorHandler?: DS.GetErrorHandler,
			) => data.length > 0
				? DS.SuccessSymbol
				: errorHandler?.().addIssue(self, data) ?? DS.ErrorSymbol,
		);

		interface ArrayConstraint extends DCommon.UnionToIntersection<
			& DS.Constraint<readonly string[]>
			& DKind.Kind<typeof constraintKind>
		> {}

		const ArrayConstraint = DS.createConstraint(
			constraintKind,
			({ init }) => () => init<ArrayConstraint>(
				{},
				{
					executeCheck,
					isAsynchronous: () => false,
				},
			),
		);
		const arrayConstraint = ArrayConstraint();
		const structure = DS.ArrayStructure(
			DS.TypeStructure(DS.StringType(), []),
			[arrayConstraint],
		);
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(data) => String(data),
		);
		const encoded = structure.encode({ codec }, ["Jane"]);
		const decoded = await structure.asyncDecode({ codec }, [4]);

		expect(encoded).toStrictEqual(DEither.right("encode-success", [4]));
		expect(decoded).toStrictEqual(DEither.right("decode-success", ["4"]));
		expect(executeCheck).toHaveBeenCalledWith(
			arrayConstraint,
			["Jane"],
			expect.any(Function),
		);
		expect(executeCheck).toHaveBeenCalledWith(
			arrayConstraint,
			["4"],
			expect.any(Function),
		);
	});

	it("returns encode and decode errors when array constraints fail", async() => {
		const constraintKind = DS.createKind("test-public-array-failing-constraint");

		interface FailingConstraint extends DCommon.UnionToIntersection<
			& DS.Constraint<readonly string[]>
			& DKind.Kind<typeof constraintKind>
		> {}

		const FailingConstraint = DS.createConstraint(
			constraintKind,
			({ init }) => () => init<FailingConstraint>(
				{},
				{
					executeCheck: (self, data, errorHandler) => (
						errorHandler?.().addIssue(self, data) ?? DS.ErrorSymbol
					),
					isAsynchronous: () => false,
				},
			),
		);
		const failingConstraint = FailingConstraint();
		const structure = DS.ArrayStructure(
			DS.TypeStructure(DS.StringType(), []),
			[failingConstraint],
		);
		const encodeFailure = structure.encode({}, ["Jane"]);
		const decodeFailure = await structure.asyncDecode({}, ["Jane"]);

		expect(
			DEither.unwrapByInformationOrThrow(
				encodeFailure,
				"encode-error",
			).issues[0]?.getSource(),
		).toBe(failingConstraint);
		expect(
			DEither.unwrapByInformationOrThrow(
				decodeFailure,
				"decode-error",
			).issues[0]?.getSource(),
		).toBe(failingConstraint);
	});

	it("returns encode constraint errors after encoding elements", () => {
		const constraintKind = DS.createKind("test-public-array-encode-after-constraint");
		const encode = vi.fn((data: string) => data.length);

		interface FailingConstraint extends DCommon.UnionToIntersection<
			& DS.Constraint<readonly string[]>
			& DKind.Kind<typeof constraintKind>
		> {}

		const FailingConstraint = DS.createConstraint(
			constraintKind,
			({ init }) => () => init<FailingConstraint>(
				{},
				{
					executeCheck: (self, data, errorHandler) => (
						errorHandler?.().addIssue(self, data) ?? DS.ErrorSymbol
					),
					isAsynchronous: () => false,
				},
			),
		);
		const failingConstraint = FailingConstraint();
		const structure = DS.ArrayStructure(
			DS.TypeStructure(DS.StringType(), []),
			[failingConstraint],
		);
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			encode,
			(data) => String(data),
		);
		const failure = structure.encode({ codec }, ["Jane"]);

		expect(
			DEither.unwrapByInformationOrThrow(
				failure,
				"encode-error",
			).issues[0]?.getSource(),
		).toBe(failingConstraint);
		expect(encode).toHaveBeenCalledWith("Jane", expect.any(Function));
	});

	it("returns async errors for asynchronous homogeneous element codecs in synchronous APIs", async() => {
		const structure = DS.ArrayStructure(
			DS.TypeStructure(DS.StringType(), []),
			[],
		);
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => Promise.resolve(data.length),
			(data) => Promise.resolve(String(data)),
		);

		expect(structure.encode({ codec }, ["Jane"])).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncEncode({ codec }, ["Jane"])).toStrictEqual(
			DEither.right("encode-success", [4]),
		);
		expect(structure.decode({ codec }, [4])).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncDecode({ codec }, [4])).toStrictEqual(
			DEither.right("decode-success", ["4"]),
		);
		expect(structure.isAsynchronous()).toBe(false);
	});
});
