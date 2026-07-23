import { describe, expect, it, vi } from "vitest";
import { DS, type DCommon, type DKind, DEither, type ExpectType } from "@scripts";

describe("createStructure", () => {
	it("creates a structure that checks its implementation before its constraints", () => {
		const testStructureKind = DS.createKind("test-structure");

		const testConstraintKind = DS.createKind("test-passing-constraint");
		const constraintExecuteCheck = vi.fn(
			(): DS.SuccessSymbol => DS.SuccessSymbol,
		);
		const structureExecuteCheck = vi.fn(
			(_self: TestStructure, data: unknown) => typeof data === "string"
				? DS.SuccessSymbol
				: DS.ErrorSymbol,
		);

		interface StringConstraint extends DCommon.UnionToIntersection<
			& DS.Constraint<string>
			& DKind.Kind<typeof testConstraintKind>
		> {}

		const TestConstraint = DS.createConstraint(
			testConstraintKind,
			({ init }) => () => init<StringConstraint>(
				{},
				{
					executeCheck: constraintExecuteCheck,
					isAsynchronous: () => false,
				},
			),
		);

		const passingConstraint = TestConstraint();

		interface TestStructure extends DCommon.UnionToIntersection<
			& DS.Structure<
				string,
				DS.StructureDefinition<readonly [StringConstraint]>
			>
			& DKind.Kind<typeof testStructureKind>
		> {}

		const TestStructure = DS.createStructure(
			testStructureKind,
			({ init }) => () => init<TestStructure>(
				{ constraints: [passingConstraint] },
				{
					executeCheck: structureExecuteCheck,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => false,
				},
			),
		);

		const structure = TestStructure();

		type _CheckStructure = ExpectType<
			typeof structure,
			TestStructure,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			string,
			"strict"
		>;

		expect(structure.executeCheck("value")).toBe(DS.SuccessSymbol);
		expect(structureExecuteCheck).toHaveBeenCalledWith(
			structure,
			"value",
			undefined,
		);
		expect(constraintExecuteCheck).toHaveBeenCalledWith(
			passingConstraint,
			"value",
			undefined,
		);
		expect(structureExecuteCheck.mock.invocationCallOrder[0]).toBeLessThan(
			constraintExecuteCheck.mock.invocationCallOrder[0]!,
		);

		structureExecuteCheck.mockClear();
		constraintExecuteCheck.mockClear();
		expect(structure.executeCheck(123)).toBe(DS.ErrorSymbol);
		expect(structureExecuteCheck).toHaveBeenCalledOnce();
		expect(constraintExecuteCheck).not.toHaveBeenCalled();
	});

	it("adds constraints immutably and stops after the first failing constraint", () => {
		const testStructureKind = DS.createKind("test-structure-add-constraint");

		const testConstraintKind = DS.createKind("test-named-constraint");
		const executeCheck = vi.fn((self: TestConstraint) => self.definition.result);

		interface TestConstraintDefinition extends DS.ConstraintDefinition {
			readonly name: string;
			readonly result: DS.SuccessSymbol | DS.ErrorSymbol;
		}

		interface TestConstraint extends DCommon.UnionToIntersection<
			& DS.Constraint<
				string,
				string,
				TestConstraintDefinition
			>
			& DKind.Kind<typeof testConstraintKind>
		> {
			readonly name: string;
		}

		const TestConstraint = DS.createConstraint(
			testConstraintKind,
			({ init }) => (
				name: string,
				result: DS.SuccessSymbol | DS.ErrorSymbol,
			) => init<TestConstraint>(
				{
					name,
					result,
				},
				{
					executeCheck,
					isAsynchronous: () => false,
				},
			),
		);

		const passingConstraint = TestConstraint("passing", DS.SuccessSymbol);
		const failingConstraint = TestConstraint("failing", DS.ErrorSymbol);
		const skippedConstraint = TestConstraint("skipped", DS.SuccessSymbol);

		const TestStructure = DS.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{ constraints: [passingConstraint] },
				{
					executeCheck: () => DS.SuccessSymbol,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => false,
				},
			),
		);

		const structure = TestStructure();
		const constrainedStructure = structure.addConstraint(
			failingConstraint,
			skippedConstraint,
		);

		expect(structure.definition.constraints).toEqual([passingConstraint]);
		expect(constrainedStructure.definition.constraints).toEqual([
			passingConstraint,
			failingConstraint,
			skippedConstraint,
		]);
		expect(constrainedStructure.executeConstraints("value")).toBe(DS.ErrorSymbol);
		expect(executeCheck).toHaveBeenNthCalledWith(
			1,
			passingConstraint,
			"value",
			undefined,
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			2,
			failingConstraint,
			"value",
			undefined,
		);
		expect(executeCheck).not.toHaveBeenCalledWith(
			skippedConstraint,
			"value",
			undefined,
		);
	});

	it("caches asynchronous detection after checking constraints and structure implementation", () => {
		const testStructureKind = DS.createKind("test-structure-async-cache");
		const constraintIsAsynchronous = vi.fn(() => false);
		const structureIsAsynchronous = vi.fn(() => true);

		const testConstraintKind = DS.createKind("test-sync-constraint");
		const SyncConstraint = DS.createConstraint(
			testConstraintKind,
			({ init }) => () => init<
				DCommon.UnionToIntersection<
					& DS.Constraint<string>
					& DKind.Kind<typeof testConstraintKind>
				>
			>(
				{},
				{
					executeCheck: () => DS.SuccessSymbol,
					isAsynchronous: constraintIsAsynchronous,
				},
			),
		);
		const syncConstraint = SyncConstraint();

		const TestStructure = DS.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{ constraints: [syncConstraint] },
				{
					executeCheck: () => DS.SuccessSymbol,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: structureIsAsynchronous,
				},
			),
		);

		const structure = TestStructure();

		expect(structure.isAsynchronous()).toBe(true);
		expect(structure.isAsynchronous()).toBe(true);
		expect(constraintIsAsynchronous).toHaveBeenCalledOnce();
		expect(structureIsAsynchronous).toHaveBeenCalledOnce();
	});

	it("detects asynchronous structures from constraints before checking the implementation", () => {
		const testStructureKind = DS.createKind("test-constraint-async-structure");
		const testConstraintKind = DS.createKind("test-async-constraint");
		const structureIsAsynchronous = vi.fn(() => false);

		const AsyncConstraint = DS.createConstraint(
			testConstraintKind,
			({ init }) => () => init<
				& DS.Constraint<string>
				& DKind.Kind<typeof testConstraintKind>
			>(
				{},
				{
					executeCheck: () => DS.SuccessSymbol,
					isAsynchronous: () => true,
				},
			),
		);

		const TestStructure = DS.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{ constraints: [AsyncConstraint()] },
				{
					executeCheck: () => DS.SuccessSymbol,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: structureIsAsynchronous,
				},
			),
		);

		expect(TestStructure().isAsynchronous()).toBe(true);
		expect(structureIsAsynchronous).not.toHaveBeenCalled();
	});

	it("preserves asynchronous constraint execution order", async() => {
		const testStructureKind = DS.createKind("test-async-constraint-chain");
		const testConstraintKind = DS.createKind("test-async-chain-constraint");
		const executeCheck = vi.fn(
			(self: TestConstraint) => Promise.resolve(self.definition.result),
		);

		interface TestConstraintDefinition extends DS.ConstraintDefinition {
			readonly result: DS.SuccessSymbol | DS.ErrorSymbol;
		}

		interface TestConstraint extends DCommon.UnionToIntersection<
			& DS.Constraint<string, string, TestConstraintDefinition>
			& DKind.Kind<typeof testConstraintKind>
		> {}

		const TestConstraint = DS.createConstraint(
			testConstraintKind,
			({ init }) => (
				result: DS.SuccessSymbol | DS.ErrorSymbol,
			) => init<TestConstraint>(
				{ result },
				{
					executeCheck,
					isAsynchronous: () => true,
				},
			),
		);

		const passingConstraint = TestConstraint(DS.SuccessSymbol);
		const failingConstraint = TestConstraint(DS.ErrorSymbol);
		const skippedConstraint = TestConstraint(DS.SuccessSymbol);
		const TestStructure = DS.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{
					constraints: [
						passingConstraint,
						failingConstraint,
						skippedConstraint,
					],
				},
				{
					executeCheck: () => DS.SuccessSymbol,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => true,
				},
			),
		);

		const structure = TestStructure();

		await expect(structure.executeConstraints("value")).resolves.toBe(
			DS.ErrorSymbol,
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			1,
			passingConstraint,
			"value",
			undefined,
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			2,
			failingConstraint,
			"value",
			undefined,
		);
		expect(executeCheck).not.toHaveBeenCalledWith(
			skippedConstraint,
			"value",
			undefined,
		);
	});

	it("returns check results for synchronous, asynchronous and predicate usages", async() => {
		const syncStructureKind = DS.createKind("test-sync-check-structure");
		const asyncStructureKind = DS.createKind("test-async-check-structure");

		const SyncStructure = DS.createStructure(
			syncStructureKind,
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: (_self, data, errorHandler) => typeof data === "string"
						? DS.SuccessSymbol
						: errorHandler?.().addIssue(_self) ?? DS.ErrorSymbol,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => false,
				},
			),
		);
		const AsyncStructure = DS.createStructure(
			asyncStructureKind,
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: () => Promise.resolve(DS.SuccessSymbol),
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => true,
				},
			),
		);
		const AsyncErrorStructure = DS.createStructure(
			DS.createKind("test-async-check-error-structure"),
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: (self, _data, errorHandler) => Promise.resolve(
						errorHandler?.().addIssue(self) ?? DS.ErrorSymbol,
					),
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => true,
				},
			),
		);

		const syncStructure = SyncStructure();
		const asyncStructure = AsyncStructure();
		const asyncErrorStructure = AsyncErrorStructure();

		const success = syncStructure.check("value");
		const failure = syncStructure.check(123);
		const asyncFailure = asyncStructure.check("value");
		const asyncSuccess = await asyncStructure.asyncCheck("value");
		const asyncCheckFailure = await asyncErrorStructure.asyncCheck("value");

		expect(success).toStrictEqual(DEither.right("check-success", "value"));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues,
		).toHaveLength(1);
		expect(asyncFailure).toStrictEqual(DEither.left("async-error", undefined));
		expect(asyncSuccess).toStrictEqual(DEither.right("check-success", "value"));
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncCheckFailure,
				"check-error",
			).issues,
		).toHaveLength(1);
		expect(syncStructure.is("value")).toBe(true);
		expect(syncStructure.is(123)).toBe(false);
		expect(asyncStructure.is("value")).toBe(false);
	});

	it("wraps synchronous and asynchronous encode results", async() => {
		const testStructureKind = DS.createKind("test-encode-structure");
		const fundamentalType = DS.createFundamentalType<
			DS.FundamentalType<symbol, string>
		>(
			Symbol("encode-string"),
			() => DS.SuccessSymbol,
		);
		const encodedStructure = DS.TypeStructure(DS.StringType());
		const codec = DS.createCodec(
			fundamentalType,
			encodedStructure,
			(data) => data.toUpperCase(),
			(data) => String(data),
		);

		const TestStructure = DS.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: () => DS.SuccessSymbol,
					executeEncode: (_self, codecContext, data) => {
						const selectedCodec = codecContext.get(fundamentalType);
						return selectedCodec?.encode(data as never) ?? data;
					},
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => false,
				},
			),
		);
		const AsyncEncodeStructure = DS.createStructure(
			DS.createKind("test-async-encode-structure"),
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: () => DS.SuccessSymbol,
					executeEncode: () => Promise.resolve("encoded"),
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => true,
				},
			),
		);

		const structure = TestStructure();
		const asyncStructure = AsyncEncodeStructure();
		const success = structure.encode({ codec }, "abcd");
		const fallbackSuccess = structure.unsafeEncode({}, "value");
		const asyncFailure = asyncStructure.encode({}, "value");
		const asyncSuccess = await asyncStructure.asyncEncode({ codec }, "value");
		const asyncUnsafeSuccess = await asyncStructure.asyncUnsafeEncode(
			{ codec },
			"value",
		);

		expect(success).toStrictEqual(DEither.right("encode-success", "ABCD"));
		expect(fallbackSuccess).toStrictEqual(DEither.right("encode-success", "value"));
		expect(asyncFailure).toStrictEqual(DEither.left("async-error", undefined));
		expect(asyncSuccess).toStrictEqual(DEither.right("encode-success", "encoded"));
		expect(asyncUnsafeSuccess).toStrictEqual(DEither.right("encode-success", "encoded"));
	});

	it("wraps encode errors with collected issues", async() => {
		const testStructureKind = DS.createKind("test-encode-error-structure");

		const TestStructure = DS.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: () => DS.SuccessSymbol,
					executeEncode: (self, _codecContext, _data, errorHandler) => (
						errorHandler?.().addIssue(self) ?? DS.ErrorSymbol
					),
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => false,
				},
			),
		);

		const structure = TestStructure();
		const failure = structure.encode({}, "value");
		const asyncFailure = await structure.asyncEncode({}, "value");
		const unsafeAsyncFailure = await structure.asyncUnsafeEncode({}, "value");

		expect(
			DEither.unwrapByInformationOrThrow(failure, "encode-error").issues,
		).toHaveLength(1);
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncFailure,
				"encode-error",
			).issues,
		).toHaveLength(1);
		expect(
			DEither.unwrapByInformationOrThrow(
				unsafeAsyncFailure,
				"encode-error",
			).issues,
		).toHaveLength(1);
	});

	it("wraps synchronous and asynchronous decode results", async() => {
		const testStructureKind = DS.createKind("test-decode-structure");
		const fundamentalType = DS.createFundamentalType<
			DS.FundamentalType<symbol, string>
		>(
			Symbol("decode-string"),
			() => DS.SuccessSymbol,
		);
		const encodedStructure = DS.TypeStructure(DS.StringType());
		const codec = DS.createCodec(
			fundamentalType,
			encodedStructure,
			(data) => data,
			(data) => data,
		);

		const TestStructure = DS.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: () => DS.SuccessSymbol,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => String(data),
					isAsynchronous: () => false,
				},
			),
		);
		const AsyncDecodeStructure = DS.createStructure(
			DS.createKind("test-async-decode-structure"),
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: () => DS.SuccessSymbol,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: () => Promise.resolve("decoded"),
					isAsynchronous: () => true,
				},
			),
		);

		const structure = TestStructure();
		const asyncStructure = AsyncDecodeStructure();
		const success = structure.decode({ codec }, 123 as never);
		const asyncFailure = asyncStructure.decode({ codec }, "value");
		const asyncSuccess = await asyncStructure.asyncDecode({ codec }, "value");
		const asyncUnsafeSuccess = await asyncStructure.asyncUnsafeDecode(
			{ codec },
			"value",
		);

		expect(success).toStrictEqual(DEither.right("decode-success", "123"));
		expect(asyncFailure).toStrictEqual(DEither.left("async-error", undefined));
		expect(asyncSuccess).toStrictEqual(DEither.right("decode-success", "decoded"));
		expect(asyncUnsafeSuccess).toStrictEqual(DEither.right("decode-success", "decoded"));
	});

	it("wraps decode errors with collected issues", async() => {
		const testStructureKind = DS.createKind("test-decode-error-structure");

		const TestStructure = DS.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: () => DS.SuccessSymbol,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (self, _codecContext, _data, errorHandler) => (
						errorHandler?.().addIssue(self) ?? DS.ErrorSymbol
					),
					isAsynchronous: () => false,
				},
			),
		);

		const structure = TestStructure();
		const failure = structure.decode({}, "value");
		const asyncFailure = await structure.asyncDecode({}, "value");
		const unsafeAsyncFailure = await structure.asyncUnsafeDecode({}, "value");

		expect(
			DEither.unwrapByInformationOrThrow(failure, "decode-error").issues,
		).toHaveLength(1);
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncFailure,
				"decode-error",
			).issues,
		).toHaveLength(1);
		expect(
			DEither.unwrapByInformationOrThrow(
				unsafeAsyncFailure,
				"decode-error",
			).issues,
		).toHaveLength(1);
	});
});
