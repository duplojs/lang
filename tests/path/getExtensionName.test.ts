import { DPath, pipe, type ExpectType } from "@scripts";

describe("getExtensionName", () => {
	it("returns the extension of file names", () => {
		const firstPath = "file.txt" as string;
		const secondPath = "test/file.txt" as string;
		const thirdPath = "/test/file.txt" as string;
		const fourthPath = "archive.tar.gz" as string;

		expect(DPath.is(firstPath)).toBe(true);
		expect(DPath.is(secondPath)).toBe(true);
		expect(DPath.is(thirdPath)).toBe(true);
		expect(DPath.is(fourthPath)).toBe(true);

		if (
			DPath.is(firstPath)
			&& DPath.is(secondPath)
			&& DPath.is(thirdPath)
			&& DPath.is(fourthPath)
		) {
			expect(DPath.getExtensionName(firstPath)).toBe("txt");
			expect(DPath.getExtensionName(secondPath)).toBe("txt");
			expect(DPath.getExtensionName(thirdPath)).toBe("txt");
			expect(DPath.getExtensionName(fourthPath)).toBe("gz");

			type _CheckPath = ExpectType<
				typeof thirdPath,
				string & DPath.Path,
				"strict"
			>;
		}
	});

	it("returns the extension with a leading dot when requested", () => {
		const firstPath = "file.txt" as string;
		const secondPath = "test/file.txt" as string;
		const thirdPath = "archive.tar.gz" as string;

		expect(DPath.is(firstPath)).toBe(true);
		expect(DPath.is(secondPath)).toBe(true);
		expect(DPath.is(thirdPath)).toBe(true);

		if (
			DPath.is(firstPath)
			&& DPath.is(secondPath)
			&& DPath.is(thirdPath)
		) {
			expect(DPath.getExtensionName(firstPath, { withDot: true })).toBe(".txt");
			expect(DPath.getExtensionName(secondPath, { withDot: true })).toBe(".txt");
			expect(DPath.getExtensionName(thirdPath, { withDot: true })).toBe(".gz");
		}
	});

	it("returns an empty string when no extension can be found", () => {
		const firstPath = "file." as string;
		const secondPath = "file" as string;

		expect(DPath.is(firstPath)).toBe(true);
		expect(DPath.is(secondPath)).toBe(true);

		if (DPath.is(firstPath) && DPath.is(secondPath)) {
			expect(DPath.getExtensionName(firstPath)).toBe("");
			expect(DPath.getExtensionName(secondPath)).toBe("");
		}
	});

	it("requires a path input", () => {
		const path = "file.txt" as string;

		// @ts-expect-error path must be validated before extraction.
		expect(DPath.getExtensionName(path)).toBe("txt");
	});

	it("can be used directly in a pipe", () => {
		const path = "file.txt" as string;

		expect(DPath.is(path)).toBe(true);

		if (DPath.is(path)) {
			const result = pipe(
				path,
				DPath.getExtensionName,
			);

			expect(result).toBe("txt");

			type _CheckResult = ExpectType<
				typeof result,
				string,
				"strict"
			>;
		}
	});
});
