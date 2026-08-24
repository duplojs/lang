import { DCommon, DPath, pipe, type ExpectType } from "@scripts";

describe("getBaseName", () => {
	it("returns the base name of paths", () => {
		const firstPath: string & DPath.Path = DCommon.infer("/alpha/beta/file.txt");
		const secondPath: string & DPath.Path = DCommon.infer("beta/file.txt");
		const thirdPath: string & DPath.Path = DCommon.infer("file.txt");

		expect(DPath.getBaseName(firstPath)).toBe("file.txt");
		expect(DPath.getBaseName(secondPath)).toBe("file.txt");
		expect(DPath.getBaseName(thirdPath)).toBe("file.txt");
	});

	it("removes the extension when requested", () => {
		const path: string & DPath.Path = DCommon.infer("/alpha/beta/file.txt");

		expect(
			DPath.getBaseName(path, { removeExtension: true }),
		).toBe("file");
		expect(
			DPath.getBaseName(path, { removeExtension: false }),
		).toBe("file.txt");
	});

	it("returns null for root paths", () => {
		const path: string & DPath.Path = DCommon.infer("/");

		expect(DPath.getBaseName(path)).toBeNull();
	});

	it("narrows the output when the input is a path", () => {
		const path: string & DPath.Path = DCommon.infer("/alpha/beta/file.txt");

		const result = DPath.getBaseName(path);

		expect(result).toBe("file.txt");

		type _CheckResult = ExpectType<
			typeof result,
			string | null,
			"strict"
		>;
	});

	it("keeps a wide output when the extension is removed", () => {
		const path: string & DPath.Path = DCommon.infer("/alpha/beta/.env");

		const result = DPath.getBaseName(path, { removeExtension: true });

		expect(result).toBe(".env");

		type _CheckResult = ExpectType<
			typeof result,
			string | null,
			"strict"
		>;
	});

	it("requires a path input", () => {
		const path = DCommon.infer("/alpha/beta/file.txt");

		// @ts-expect-error path must be validated before extraction.
		expect(DPath.getBaseName(path)).toBe("file.txt");
	});

	it("can be used directly in a pipe", () => {
		const path: string & DPath.Path = DCommon.infer("/alpha/beta/file.txt");

		const result = pipe(
			path,
			DPath.getBaseName,
		);

		expect(result).toBe("file.txt");

		type _CheckResult = ExpectType<
			typeof result,
			string | null,
			"strict"
		>;
	});
});
