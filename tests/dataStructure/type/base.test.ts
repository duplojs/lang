import { describe, expect, it, vi } from "vitest";
import { DS, type DCommon, type DKind, type ExpectType } from "@scripts";

describe("createType", () => {
	it("checks the fundamental type before delegating to the type implementation", () => {
		const fundamentalSymbol = Symbol("test-string");
		const testTypeKind = DS.createKind("test-type");

		interface TestFundamentalType extends DS.FundamentalType<
			typeof fundamentalSymbol,
			string
		> {}

		const fundamentalTypeExecuteCheck = vi.fn(
			(
				self: TestFundamentalType,
				data: unknown,
				errorHandler?: DS.GetErrorHandler,
			) => typeof data === "string"
				? DS.SuccessSymbol
				: errorHandler?.().addIssue(self) ?? DS.ErrorSymbol,
		);
		const fundamentalType = DS.createFundamentalType<TestFundamentalType>(
			fundamentalSymbol,
			fundamentalTypeExecuteCheck,
		);

		interface TestTypeDefinition extends DS.TypeDefinition {
			readonly literal: "valid";
		}

		interface TestType extends DCommon.UnionToIntersection<
			& DS.Type<
				typeof fundamentalType,
				"valid",
				TestTypeDefinition
			>
			& DKind.Kind<typeof testTypeKind>
		> {}

		const executeCheck = vi.fn(
			(
				self: TestType,
				data: string,
				errorHandler?: DS.GetErrorHandler,
			) => data === self.definition.literal
				? DS.SuccessSymbol
				: errorHandler?.().addIssue(self) ?? DS.ErrorSymbol,
		);
		const isAsynchronous = vi.fn(() => false);

		const TestType = DS.createType(
			fundamentalType,
			testTypeKind,
			({ init }) => () => init<TestType>(
				{ literal: "valid" },
				{
					executeCheck,
					isAsynchronous,
				},
			),
		);

		const type = TestType();

		type _CheckType = ExpectType<
			typeof type,
			TestType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DS.TypeValue<typeof type>,
			"valid",
			"strict"
		>;

		expect(type.fundamentalType).toBe(fundamentalType);
		expect(type.definition).toEqual({ literal: "valid" });
		expect(type.executeCheck("valid")).toBe(DS.SuccessSymbol);
		expect(type.executeCheck("invalid")).toBe(DS.ErrorSymbol);
		expect(type.executeCheck(123 as never)).toBe(DS.ErrorSymbol);
		expect(type.isAsynchronous()).toBe(false);
		expect(fundamentalTypeExecuteCheck).toHaveBeenNthCalledWith(
			1,
			fundamentalType,
			"valid",
			undefined,
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			1,
			type,
			"valid",
			undefined,
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			2,
			type,
			"invalid",
			undefined,
		);
		expect(executeCheck).not.toHaveBeenCalledWith(
			type,
			123,
		);
		expect(isAsynchronous).toHaveBeenCalledWith(type);
	});

	it("forwards the error handler to the fundamental type and the type implementation", () => {
		const fundamentalSymbol = Symbol("test-string-error-handler");
		const testTypeKind = DS.createKind("test-type-error-handler");
		const errorHandler = DS.createGetErrorHandler();

		interface TestFundamentalType extends DS.FundamentalType<
			typeof fundamentalSymbol,
			string
		> {}

		const fundamentalTypeExecuteCheck = vi.fn(
			(): DS.SuccessSymbol => DS.SuccessSymbol,
		);
		const fundamentalType = DS.createFundamentalType<TestFundamentalType>(
			fundamentalSymbol,
			fundamentalTypeExecuteCheck,
		);

		interface TestType extends DCommon.UnionToIntersection<
			& DS.Type<typeof fundamentalType>
			& DKind.Kind<typeof testTypeKind>
		> {}

		const executeCheck = vi.fn(
			(): DS.SuccessSymbol => DS.SuccessSymbol,
		);
		const TestType = DS.createType(
			fundamentalType,
			testTypeKind,
			({ init }) => () => init<TestType>(
				{},
				{
					executeCheck,
					isAsynchronous: () => false,
				},
			),
		);

		const type = TestType();

		expect(type.executeCheck("valid", errorHandler)).toBe(DS.SuccessSymbol);
		expect(fundamentalTypeExecuteCheck).toHaveBeenCalledWith(
			fundamentalType,
			"valid",
			errorHandler,
		);
		expect(executeCheck).toHaveBeenCalledWith(
			type,
			"valid",
			errorHandler,
		);
	});

	it("preserves asynchronous checks through the fundamental type and implementation", async() => {
		const fundamentalSymbol = Symbol("test-async-string");
		const testTypeKind = DS.createKind("test-async-type");
		const errorHandler = DS.createGetErrorHandler();

		interface TestFundamentalType extends DS.FundamentalType<
			typeof fundamentalSymbol,
			string
		> {}

		const fundamentalTypeExecuteCheck = vi.fn(
			(
				self: TestFundamentalType,
				data: unknown,
				errorHandler?: DS.GetErrorHandler,
			) => Promise.resolve(typeof data === "string"
				? DS.SuccessSymbol
				: errorHandler?.().addIssue(self) ?? DS.ErrorSymbol),
		);
		const fundamentalType = DS.createFundamentalType<TestFundamentalType>(
			fundamentalSymbol,
			fundamentalTypeExecuteCheck,
		);

		interface TestType extends DCommon.UnionToIntersection<
			& DS.Type<typeof fundamentalType>
			& DKind.Kind<typeof testTypeKind>
		> {}

		const executeCheck = vi.fn(
			(
				self: TestType,
				data: string,
				errorHandler?: DS.GetErrorHandler,
			) => Promise.resolve(data === "valid"
				? DS.SuccessSymbol
				: errorHandler?.().addIssue(self) ?? DS.ErrorSymbol),
		);
		const TestType = DS.createType(
			fundamentalType,
			testTypeKind,
			({ init }) => () => init<TestType>(
				{},
				{
					executeCheck,
					isAsynchronous: () => true,
				},
			),
		);

		const type = TestType();

		await expect(type.executeCheck("valid", errorHandler)).resolves.toBe(
			DS.SuccessSymbol,
		);
		await expect(type.executeCheck("invalid", errorHandler)).resolves.toBe(
			DS.ErrorSymbol,
		);
		await expect(type.executeCheck(123 as never, errorHandler)).resolves.toBe(
			DS.ErrorSymbol,
		);
		expect(fundamentalTypeExecuteCheck).toHaveBeenNthCalledWith(
			1,
			fundamentalType,
			"valid",
			errorHandler,
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			1,
			type,
			"valid",
			errorHandler,
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			2,
			type,
			"invalid",
			errorHandler,
		);
		expect(executeCheck).not.toHaveBeenCalledWith(
			type,
			123,
			errorHandler,
		);
		expect(errorHandler().createError().issues).toHaveLength(2);
	});
});
