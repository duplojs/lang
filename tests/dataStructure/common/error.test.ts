import { describe, expect, it } from "vitest";
import { DS } from "@scripts";

describe("createErrorHandler", () => {
	it("collects issues with their source, data, context and path", () => {
		const errorHandler = DS.createErrorHandler();
		const pathStage = errorHandler.createPathStage();

		errorHandler.setCurrentContext("encode");
		pathStage.setCurrentPath("name");
		errorHandler.addIssue(DS.TheString, 123);

		expect(errorHandler.issues).toHaveLength(1);
		expect(errorHandler.issues[0]).toMatchObject({
			context: "encode",
			data: 123,
			path: "name",
		});
		expect(errorHandler.issues[0]?.getSource()).toBe(DS.TheString);
	});

	it("handles nested path stages and closes them in order", () => {
		const errorHandler = DS.createErrorHandler();
		const firstPathStage = errorHandler.createPathStage();

		firstPathStage.setCurrentPath("user");
		const secondPathStage = errorHandler.createPathStage();
		secondPathStage.setCurrentPath("name");
		errorHandler.addIssue(DS.TheString, 123);

		secondPathStage.close();
		errorHandler.addIssue(DS.TheNumber, "not-a-number");

		firstPathStage.close();
		errorHandler.addIssue(DS.TheBigint, "not-a-bigint");

		expect(errorHandler.issues.map((issue) => issue.path)).toStrictEqual([
			"user.name",
			"user",
			"",
		]);
	});

	it("ignores closing a path stage when no stage is open", () => {
		const errorHandler = DS.createErrorHandler();
		const pathStage = errorHandler.createPathStage();

		pathStage.close();
		pathStage.close();
		errorHandler.addIssue(DS.TheString, "value");

		expect(errorHandler.currentPath).toStrictEqual([]);
		expect(errorHandler.issues[0]?.path).toBe("");
	});

	it("creates an error from the collected issues", () => {
		const errorHandler = DS.createErrorHandler();

		errorHandler.addIssue(DS.TheString, 123);

		expect(errorHandler.createError()).toStrictEqual({
			issues: errorHandler.issues,
		});
	});
});

describe("createGetErrorHandler", () => {
	it("lazily creates and reuses the same error handler", () => {
		const getErrorHandler = DS.createGetErrorHandler();
		const firstErrorHandler = getErrorHandler();
		const secondErrorHandler = getErrorHandler();

		firstErrorHandler.addIssue(DS.TheString, 123);

		expect(secondErrorHandler).toBe(firstErrorHandler);
		expect(secondErrorHandler.issues).toHaveLength(1);
	});
});
