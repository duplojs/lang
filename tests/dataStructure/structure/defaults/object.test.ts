import { describe, expect, it, vi } from "vitest";
import { DS, DEither, type DCommon, type DKind, type ExpectType } from "@scripts";

describe("ObjectStructure", () => {
	it("checks shaped objects and narrows with is", async() => {
		const shape = {
			name: DS.TypeStructure(DS.StringType(), []),
			age: DS.TypeStructure(DS.NumberType(), []),
		};
		const structure = DS.ObjectStructure(shape, []);
		const input: unknown = {
			name: "Jane",
			age: 30,
		};
		const success = structure.check(input);
		const asyncSuccess = await structure.asyncCheck(input);

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			{
				readonly name: string;
				readonly age: number;
			},
			"strict"
		>;
		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<
				"check-success",
				{
					readonly name: string;
					readonly age: number;
				}
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"check-error", DS.Error>,
			"strict"
		>;
		type _CheckAsyncSuccess = ExpectType<
			typeof asyncSuccess,
			| DEither.Right<
				"check-success",
				{
					readonly name: string;
					readonly age: number;
				}
			>
			| DEither.Left<"check-error", DS.Error>,
			"strict"
		>;

		expect(success).toStrictEqual(DEither.right("check-success", input));
		expect(asyncSuccess).toStrictEqual(DEither.right("check-success", input));
		expect(structure.is(input)).toBe(true);
		if (structure.is(input)) {
			type _CheckNarrowedInput = ExpectType<
				typeof input,
				{
					readonly name: string;
					readonly age: number;
				},
				"strict"
			>;
		}
	});

	it("returns check errors for invalid object shapes", async() => {
		const structure = DS.ObjectStructure({
			name: DS.TypeStructure(DS.StringType(), []),
			age: DS.TypeStructure(DS.NumberType(), []),
		}, []);
		const invalidKind = structure.check(null);
		const invalidLength = structure.check({ name: "Jane" });
		const invalidProperty = structure.check({
			name: 123,
			age: 30,
		});
		const asyncInvalidProperty = await structure.asyncCheck({
			name: 123,
			age: 30,
		});

		expect(
			DEither.unwrapByInformationOrThrow(invalidKind, "check-error").issues[0],
		).toMatchObject({
			data: null,
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(invalidLength, "check-error").issues[0],
		).toMatchObject({
			data: { name: "Jane" },
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.check(new Date()),
				"check-error",
			).issues[0]?.path,
		).toBe("");
		expect(structure.check({
			name: "Jane",
			age: 30,
			[Symbol("private")]: true,
		})).not.toStrictEqual(DEither.right("check-success", undefined));
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidProperty,
				"check-error",
			).issues,
		).toHaveLength(1);
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidProperty,
				"check-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "name",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncInvalidProperty,
				"check-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "name",
		});
		expect(structure.is({
			name: 123,
			age: 30,
		})).toBe(false);
		expect(structure.is({ name: "Jane" })).toBe(false);
		expect(structure.is(null)).toBe(false);
	});

	it("returns async check errors for asynchronous shaped structures in synchronous APIs", async() => {
		const asyncTypeKind = DS.createKind("test-public-async-object-type");

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
		const structure = DS.ObjectStructure({
			name: DS.TypeStructure(AsyncType(), []),
		}, []);

		expect(structure.check({ name: "Jane" })).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncCheck({ name: "Jane" })).toStrictEqual(
			DEither.right("check-success", { name: "Jane" }),
		);
		expect(structure.is({ name: "Jane" })).toBe(false);
		expect(structure.isAsynchronous()).toBe(true);
	});

	it("encodes shaped objects with matching codecs", async() => {
		const structure = DS.ObjectStructure({
			name: DS.TypeStructure(DS.StringType(), []),
			age: DS.TypeStructure(DS.NumberType(), []),
		}, []);
		const stringCodec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(data) => `name-${data}`,
		);
		const numberCodec = DS.createCodec(
			DS.TheNumber,
			DS.TypeStructure(DS.StringType(), []),
			(data) => String(data),
			(data) => Number(data),
		);
		const codecs = {
			stringCodec,
			numberCodec,
		};
		const success = structure.encode(
			codecs,
			{
				name: "Jane",
				age: 30,
			},
		);
		const asyncSuccess = await structure.asyncEncode(
			codecs,
			{
				name: "Jane",
				age: 30,
			},
		);

		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<
				"encode-success",
				{
					readonly name: number;
					readonly age: string;
				}
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"encode-error", DS.Error>,
			"strict"
		>;
		type _CheckAsyncSuccess = ExpectType<
			typeof asyncSuccess,
			| DEither.Right<
				"encode-success",
				{
					readonly name: number;
					readonly age: string;
				}
			>
			| DEither.Left<"encode-error", DS.Error>,
			"strict"
		>;

		expect(success).toStrictEqual(
			DEither.right("encode-success", {
				name: 4,
				age: "30",
			}),
		);
		expect(asyncSuccess).toStrictEqual(
			DEither.right("encode-success", {
				name: 4,
				age: "30",
			}),
		);
	});

	it("checks object constraints against source data after encoding", async() => {
		const constraintKind = DS.createKind("test-public-object-source-constraint");
		const executeCheck = vi.fn(
			(
				self: SourceConstraint,
				data: { readonly name: string },
				errorHandler?: DS.GetErrorHandler,
			) => typeof data.name === "string"
				? DS.SuccessSymbol
				: errorHandler?.().addIssue(self, data) ?? DS.ErrorSymbol,
		);

		interface SourceConstraint extends DCommon.UnionToIntersection<
			& DS.Constraint<{ readonly name: string }>
			& DKind.Kind<typeof constraintKind>
		> {}

		const SourceConstraint = DS.createConstraint(
			constraintKind,
			({ init }) => () => init<SourceConstraint>(
				{},
				{
					executeCheck,
					isAsynchronous: () => false,
				},
			),
		);
		const sourceConstraint = SourceConstraint();
		const structure = DS.ObjectStructure(
			{
				name: DS.TypeStructure(DS.StringType(), []),
			},
			[sourceConstraint],
		);
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(data) => String(data),
		);
		const success = structure.encode({ codec }, { name: "Jane" });
		const asyncSuccess = await structure.asyncEncode({ codec }, { name: "Jane" });

		expect(success).toStrictEqual(
			DEither.right("encode-success", {
				name: 4,
			}),
		);
		expect(asyncSuccess).toStrictEqual(
			DEither.right("encode-success", {
				name: 4,
			}),
		);
		expect(executeCheck).toHaveBeenCalledWith(
			sourceConstraint,
			{ name: "Jane" },
			expect.any(Function),
		);
	});

	it("returns encode errors for invalid object shapes", () => {
		const structure = DS.ObjectStructure({
			name: DS.TypeStructure(DS.StringType(), []),
			age: DS.TypeStructure(DS.NumberType(), []),
		}, []);
		const invalidKind = structure.encode({}, null as never);
		const invalidLength = structure.encode({}, { name: "Jane" } as never);
		const invalidProperty = structure.encode(
			{},
			{
				name: 123,
				age: 30,
			} as never,
		);

		expect(
			DEither.unwrapByInformationOrThrow(invalidKind, "encode-error").issues[0],
		).toMatchObject({
			data: null,
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(invalidLength, "encode-error").issues[0],
		).toMatchObject({
			data: { name: "Jane" },
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.encode({}, new Date() as never),
				"encode-error",
			).issues[0]?.path,
		).toBe("");
		expect(structure.encode({}, {
			name: "Jane",
			age: 30,
			[Symbol("private")]: true,
		} as never)).not.toStrictEqual(DEither.right("encode-success", undefined));
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidProperty,
				"encode-error",
			).issues,
		).toHaveLength(1);
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidProperty,
				"encode-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "name",
		});
	});

	it("returns encode errors when source constraints fail after shaped properties are encoded", async() => {
		const constraintKind = DS.createKind("test-public-object-encode-error");

		interface FailingConstraint extends DCommon.UnionToIntersection<
			& DS.Constraint<{ readonly name: string }>
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
		const structure = DS.ObjectStructure(
			{
				name: DS.TypeStructure(DS.StringType(), []),
			},
			[failingConstraint],
		);
		const failure = structure.encode({}, { name: "Jane" });
		const asyncFailure = await structure.asyncEncode({}, { name: "Jane" });

		expect(
			DEither.unwrapByInformationOrThrow(failure, "encode-error").issues[0]
				?.getSource(),
		).toBe(failingConstraint);
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncFailure,
				"encode-error",
			).issues[0]?.getSource(),
		).toBe(failingConstraint);
	});

	it("returns async encode errors for asynchronous shaped encoders in synchronous APIs", async() => {
		const structure = DS.ObjectStructure({
			name: DS.TypeStructure(DS.StringType(), []),
		}, []);
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => Promise.resolve(data.length),
			(data) => String(data),
		);

		expect(structure.encode({ codec }, { name: "Jane" })).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncEncode({ codec }, { name: "Jane" })).toStrictEqual(
			DEither.right("encode-success", { name: 4 }),
		);
	});

	it("decodes shaped objects with matching codecs", async() => {
		const structure = DS.ObjectStructure({
			name: DS.TypeStructure(DS.StringType(), []),
			age: DS.TypeStructure(DS.NumberType(), []),
		}, []);
		const stringCodec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(data) => `name-${data}`,
		);
		const numberCodec = DS.createCodec(
			DS.TheNumber,
			DS.TypeStructure(DS.StringType(), []),
			(data) => String(data),
			(data) => Number(data),
		);
		const codecs = {
			stringCodec,
			numberCodec,
		};
		const success = structure.decode(
			codecs,
			{
				name: 4,
				age: "30",
			},
		);
		const asyncSuccess = await structure.asyncDecode(
			codecs,
			{
				name: 4,
				age: "30",
			},
		);

		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<
				"decode-success",
				{
					readonly name: string;
					readonly age: number;
				}
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"decode-error", DS.Error>,
			"strict"
		>;
		type _CheckAsyncSuccess = ExpectType<
			typeof asyncSuccess,
			| DEither.Right<
				"decode-success",
				{
					readonly name: string;
					readonly age: number;
				}
			>
			| DEither.Left<"decode-error", DS.Error>,
			"strict"
		>;

		expect(success).toStrictEqual(
			DEither.right("decode-success", {
				name: "name-4",
				age: 30,
			}),
		);
		expect(asyncSuccess).toStrictEqual(
			DEither.right("decode-success", {
				name: "name-4",
				age: 30,
			}),
		);
	});

	it("returns decode errors for invalid object shapes", () => {
		const structure = DS.ObjectStructure({
			name: DS.TypeStructure(DS.StringType(), []),
			age: DS.TypeStructure(DS.NumberType(), []),
		}, []);
		const invalidKind = structure.decode({}, null as never);
		const invalidLength = structure.decode({}, { name: "Jane" } as never);
		const invalidProperty = structure.decode(
			{},
			{
				name: 123,
				age: 30,
			} as never,
		);

		expect(
			DEither.unwrapByInformationOrThrow(invalidKind, "decode-error").issues[0],
		).toMatchObject({
			data: null,
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(invalidLength, "decode-error").issues[0],
		).toMatchObject({
			data: { name: "Jane" },
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.decode({}, new Date() as never),
				"decode-error",
			).issues[0]?.path,
		).toBe("");
		expect(structure.decode({}, {
			name: "Jane",
			age: 30,
			[Symbol("private")]: true,
		} as never)).not.toStrictEqual(DEither.right("decode-success", undefined));
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidProperty,
				"decode-error",
			).issues,
		).toHaveLength(1);
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidProperty,
				"decode-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "name",
		});
	});

	it("returns decode errors when decoded constraints fail", async() => {
		const constraintKind = DS.createKind("test-public-object-decode-error");

		interface FailingConstraint extends DCommon.UnionToIntersection<
			& DS.Constraint<{ readonly name: string }>
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
		const structure = DS.ObjectStructure(
			{
				name: DS.TypeStructure(DS.StringType(), []),
			},
			[failingConstraint],
		);
		const failure = structure.decode({}, { name: "Jane" });
		const asyncFailure = await structure.asyncDecode({}, { name: "Jane" });

		expect(
			DEither.unwrapByInformationOrThrow(failure, "decode-error").issues[0]
				?.getSource(),
		).toBe(failingConstraint);
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncFailure,
				"decode-error",
			).issues[0]?.getSource(),
		).toBe(failingConstraint);
	});

	it("returns async decode errors for asynchronous shaped decoders in synchronous APIs", async() => {
		const structure = DS.ObjectStructure({
			name: DS.TypeStructure(DS.StringType(), []),
		}, []);
		const codec = DS.createCodec(
			DS.TheString,
			DS.TypeStructure(DS.NumberType(), []),
			(data) => data.length,
			(data) => Promise.resolve(`name-${data}`),
		);

		expect(structure.decode({ codec }, { name: 4 })).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncDecode({ codec }, { name: 4 })).toStrictEqual(
			DEither.right("decode-success", { name: "name-4" }),
		);
	});
});
