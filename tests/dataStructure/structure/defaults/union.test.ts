import { describe, expect, it, vi } from "vitest";
import { DS, DEither, type DCommon, type DKind, type ExpectType } from "@scripts";

describe("UnionStructure", () => {
	it("checks values against the first matching structure and narrows with is", async() => {
		const structure = DS.UnionStructure([
			DS.TypeStructure(DS.StringType(), []),
			DS.TypeStructure(DS.NumberType(), []),
		], []);
		const input: unknown = "value";
		const success = structure.check(input);
		const numberSuccess = await structure.asyncCheck(42);
		const failure = structure.check(true);

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			string | number,
			"strict"
		>;
		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<"check-success", string | number>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"check-error", DS.Error>,
			"strict"
		>;
		type _CheckNumberSuccess = ExpectType<
			typeof numberSuccess,
			| DEither.Right<"check-success", string | number>
			| DEither.Left<"check-error", DS.Error>,
			"strict"
		>;

		expect(success).toStrictEqual(DEither.right("check-success", input));
		expect(numberSuccess).toStrictEqual(DEither.right("check-success", 42));
		expect(structure.is(input)).toBe(true);
		if (structure.is(input)) {
			type _CheckNarrowedInput = ExpectType<
				typeof input,
				string | number,
				"strict"
			>;
		}
		expect(structure.is(true)).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues,
		).toMatchObject([
			{
				data: true,
				path: "(union: 0)",
			},
			{
				data: true,
				path: "(union: 1)",
			},
		]);
	});

	it("flattens nested union structures", () => {
		const stringStructure = DS.TypeStructure(DS.StringType(), []);
		const numberStructure = DS.TypeStructure(DS.NumberType(), []);
		const bigintStructure = DS.TypeStructure(DS.BigintType(), []);
		const nestedUnion = DS.UnionStructure([
			numberStructure,
			bigintStructure,
		], []);
		const structure = DS.UnionStructure([
			stringStructure,
			nestedUnion,
		], []);

		expect(structure.definition.values).toStrictEqual([
			stringStructure,
			numberStructure,
			bigintStructure,
		]);
		expect(structure.check(1n)).toStrictEqual(
			DEither.right("check-success", 1n),
		);
	});

	it("encodes and decodes values with the first matching branch", async() => {
		const structure = DS.UnionStructure([
			DS.TypeStructure(DS.StringType(), []),
			DS.TypeStructure(DS.NumberType(), []),
		], []);
		const stringCodec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(data) => `value-${data}`,
		);
		const numberCodec = DS.createCodec(
			DS.TheNumber,
			DS.TypeStructure(DS.StringType(), []),
			(data) => `number-${data}`,
			(data) => Number(data.slice(7)),
		);
		const codecs = {
			stringCodec,
			numberCodec,
		};
		const encodedString = structure.encode(codecs, "Jane");
		const encodedNumber = await structure.asyncEncode(codecs, 42);
		const decodedString = structure.decode(codecs, 4);
		const decodedNumber = await structure.asyncDecode(codecs, "number-42");

		type _CheckEncodedString = ExpectType<
			typeof encodedString,
			| DEither.Right<"encode-success", string | number>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"encode-error", DS.Error>,
			"strict"
		>;
		type _CheckEncodedNumber = ExpectType<
			typeof encodedNumber,
			| DEither.Right<"encode-success", string | number>
			| DEither.Left<"encode-error", DS.Error>,
			"strict"
		>;
		type _CheckDecodedString = ExpectType<
			typeof decodedString,
			| DEither.Right<"decode-success", string | number>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"decode-error", DS.Error>,
			"strict"
		>;
		type _CheckDecodedNumber = ExpectType<
			typeof decodedNumber,
			| DEither.Right<"decode-success", string | number>
			| DEither.Left<"decode-error", DS.Error>,
			"strict"
		>;

		expect(encodedString).toStrictEqual(DEither.right("encode-success", 4));
		expect(encodedNumber).toStrictEqual(
			DEither.right("encode-success", "number-42"),
		);
		expect(decodedString).toStrictEqual(
			DEither.right("decode-success", "value-4"),
		);
		expect(decodedNumber).toStrictEqual(
			DEither.right("decode-success", 42),
		);
	});

	it("imports branch errors when no structure matches during encode or decode", () => {
		const structure = DS.UnionStructure([
			DS.TypeStructure(DS.StringType(), []),
			DS.ArrayStructure(DS.TypeStructure(DS.NumberType(), []), []),
		], []);
		const encodeFailure = structure.encode({}, true as never);
		const decodeFailure = structure.decode({}, ["value"] as never);

		expect(
			DEither.unwrapByInformationOrThrow(
				encodeFailure,
				"encode-error",
			).issues,
		).toMatchObject([
			{
				data: true,
				path: "(union: 0)",
			},
			{
				data: true,
				path: "(union: 1)",
			},
		]);
		expect(
			DEither.unwrapByInformationOrThrow(
				decodeFailure,
				"decode-error",
			).issues,
		).toMatchObject([
			{
				data: ["value"],
				path: "(union: 0)",
			},
			{
				data: "value",
				path: "(union: 1).[array: 0]",
			},
		]);
	});

	it("keeps union branch paths isolated inside parent structure paths", () => {
		const structure = DS.ObjectStructure({
			value: DS.UnionStructure([
				DS.TypeStructure(DS.StringType(), []),
				DS.ArrayStructure(DS.TypeStructure(DS.NumberType(), []), []),
			], []),
		}, []);
		const failure = structure.check({ value: ["invalid"] });

		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues,
		).toMatchObject([
			{
				data: ["invalid"],
				path: "value.(union: 0)",
			},
			{
				data: "invalid",
				path: "value.(union: 1).[array: 0]",
			},
		]);
	});

	it("does not leak a successful union branch path to sibling properties", () => {
		const structure = DS.ObjectStructure({
			first: DS.UnionStructure([
				DS.TypeStructure(DS.StringType(), []),
				DS.TypeStructure(DS.NumberType(), []),
			], []),
			second: DS.TypeStructure(DS.StringType(), []),
		}, []);
		const failure = structure.check({
			first: "value",
			second: 123,
		});

		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues,
		).toMatchObject([
			{
				data: 123,
				path: "second",
			},
		]);
	});

	it("checks constraints against source data after encoding and decoded data after decoding", async() => {
		const constraintKind = DS.createKind("test-public-union-constraint");
		const executeCheck = vi.fn(
			(
				self: UnionConstraint,
				data: any,
				errorHandler?: DS.GetErrorHandler,
			) => typeof data === "string" && data.length === 0
				? errorHandler?.().addIssue(self, data) ?? DS.ErrorSymbol
				: DS.SuccessSymbol,
		);

		interface UnionConstraint extends DCommon.UnionToIntersection<
			& DS.Constraint<number | string>
			& DKind.Kind<typeof constraintKind>
		> {}

		const UnionConstraint = DS.createConstraint(
			constraintKind,
			({ init }) => () => init<UnionConstraint>(
				{},
				{
					executeCheck,
					isAsynchronous: () => false,
				},
			),
		);
		const unionConstraint = UnionConstraint();
		const stringStructure = DS.TypeStructure(DS.StringType(), []);
		const numberStructure = DS.TypeStructure(DS.NumberType(), []);
		const structure = DS.UnionStructure([
			stringStructure,
			numberStructure,
		], [unionConstraint]);
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(data) => String(data),
		);
		const encoded = structure.encode({ codec }, "Jane");
		const decoded = await structure.asyncDecode({ codec }, 4 as never);
		const encodeFailure = structure.encode({ codec }, "");
		const emptyStringCodec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			() => "",
		);
		const decodeFailure = await structure.asyncDecode(
			{ emptyStringCodec },
			0 as never,
		);

		expect(encoded).toStrictEqual(DEither.right("encode-success", 4));
		expect(decoded).toStrictEqual(DEither.right("decode-success", "4"));
		expect(
			DEither.unwrapByInformationOrThrow(
				encodeFailure,
				"encode-error",
			).issues[0]?.getSource(),
		).toBe(unionConstraint);
		expect(
			DEither.unwrapByInformationOrThrow(
				decodeFailure,
				"decode-error",
			).issues[0]?.getSource(),
		).toBe(unionConstraint);
		expect(executeCheck).toHaveBeenCalledWith(
			unionConstraint,
			"Jane",
			expect.any(Function),
		);
		expect(executeCheck).toHaveBeenCalledWith(
			unionConstraint,
			"4",
			expect.any(Function),
		);
		expect(executeCheck).toHaveBeenCalledWith(
			unionConstraint,
			"",
			expect.any(Function),
		);
		expect(executeCheck).toHaveBeenCalledWith(
			unionConstraint,
			"",
			expect.any(Function),
		);
	});

	it("returns execution symbols without collecting issues when no error handler is provided", () => {
		const structure = DS.UnionStructure([
			DS.TypeStructure(DS.StringType(), []),
			DS.ArrayStructure(DS.TypeStructure(DS.NumberType(), []), []),
		], []);

		expect(structure.executeCheck(true)).toBe(DS.ErrorSymbol);
		expect(structure.executeEncode(new Map(), true)).toBe(DS.ErrorSymbol);
		expect(structure.executeDecode(new Map(), ["value"])).toBe(DS.ErrorSymbol);
	});

	it("returns async errors for asynchronous branches in synchronous APIs", async() => {
		const asyncStructureKind = DS.createKind("test-public-union-async-structure");

		interface AsyncStructure extends DCommon.UnionToIntersection<
			& DS.Structure<string>
			& DKind.Kind<typeof asyncStructureKind>
		> {}

		const AsyncStructure = DS.createStructure(
			asyncStructureKind,
			({ init }) => () => init<AsyncStructure>(
				{
					constraints: [],
				},
				{
					executeCheck: () => Promise.resolve(DS.SuccessSymbol),
					executeEncode: (_self, _codec, data) => Promise.resolve(data),
					executeDecode: (_self, _codec, data) => Promise.resolve(data),
					isAsynchronous: () => true,
				},
			),
		);
		const structure = DS.UnionStructure([
			AsyncStructure(),
			DS.TypeStructure(DS.NumberType(), []),
		], []);

		expect(structure.check("value")).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncCheck("value")).toStrictEqual(
			DEither.right("check-success", "value"),
		);
		expect(structure.encode({}, "value")).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncEncode({}, "value")).toStrictEqual(
			DEither.right("encode-success", "value"),
		);
		expect(structure.decode({}, "value")).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncDecode({}, "value")).toStrictEqual(
			DEither.right("decode-success", "value"),
		);
		expect(structure.is("value")).toBe(false);
		expect(structure.isAsynchronous()).toBe(true);
	});
});
