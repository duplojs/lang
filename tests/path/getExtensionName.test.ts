import { DCommon, DPath, pipe, type ExpectType } from "@scripts";

describe("getExtensionName", () => {
	it("returns the extension of file names", () => {
		const firstPath: string & DPath.Path = DCommon.infer("file.txt");
		const secondPath: string & DPath.Path = DCommon.infer("test/file.txt");
		const thirdPath: string & DPath.Path = DCommon.infer("/test/file.txt");
		const fourthPath: string & DPath.Path = DCommon.infer("archive.tar.gz");

		expect(DPath.getExtensionName(firstPath)).toBe("txt");
		expect(DPath.getExtensionName(secondPath)).toBe("txt");
		expect(DPath.getExtensionName(thirdPath)).toBe("txt");
		expect(DPath.getExtensionName(fourthPath)).toBe("gz");

		type _CheckPath = ExpectType<
			typeof thirdPath,
			string & DPath.Path,
			"strict"
		>;
	});

	it("returns the extension with a leading dot when requested", () => {
		const firstPath: string & DPath.Path = DCommon.infer("file.txt");
		const secondPath: string & DPath.Path = DCommon.infer("test/file.txt");
		const thirdPath: string & DPath.Path = DCommon.infer("archive.tar.gz");

		expect(DPath.getExtensionName(firstPath, { withDot: true })).toBe(".txt");
		expect(DPath.getExtensionName(secondPath, { withDot: true })).toBe(".txt");
		expect(DPath.getExtensionName(thirdPath, { withDot: true })).toBe(".gz");
	});

	it("returns null when no extension can be found", () => {
		const firstPath: string & DPath.Path = DCommon.infer("file.");
		const secondPath: string & DPath.Path = DCommon.infer("file");
		const thirdPath: string & DPath.Path = DCommon.infer(".git");
		const fourthPath: string & DPath.Path = DCommon.infer("/");
		const fifthPath: string & DPath.Path = DCommon.infer(".");
		const sixthPath: string & DPath.Path = DCommon.infer("..");

		expect(DPath.getExtensionName(firstPath)).toBeNull();
		expect(DPath.getExtensionName(secondPath)).toBeNull();
		expect(DPath.getExtensionName(thirdPath)).toBeNull();
		expect(DPath.getExtensionName(fourthPath)).toBeNull();
		expect(DPath.getExtensionName(fifthPath)).toBeNull();
		expect(DPath.getExtensionName(sixthPath)).toBeNull();
	});

	it("requires a path input", () => {
		const path = "file.txt" as string;

		// @ts-expect-error path must be validated before extraction.
		expect(DPath.getExtensionName(path)).toBe("txt");
	});

	it("can be used directly in a pipe", () => {
		const path: string & DPath.Path = DCommon.infer("file.txt");

		const result = pipe(
			path,
			DPath.getExtensionName,
		);

		expect(result).toBe("txt");

		type _CheckResult = ExpectType<
			typeof result,
			string | null,
			"strict"
		>;
	});
});
