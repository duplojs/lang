import { DPath, pipe, type ExpectType } from "@scripts";

describe("getParentFolderPath", () => {
	it("returns the parent folder for relative paths", () => {
		const firstPath = "alpha/beta/gamma" as string;
		const secondPath = "alpha" as string;

		expect(DPath.is(firstPath)).toBe(true);
		expect(DPath.is(secondPath)).toBe(true);

		if (DPath.is(firstPath) && DPath.is(secondPath)) {
			expect(DPath.getParentFolderPath(firstPath)).toBe("alpha/beta");
			expect(DPath.getParentFolderPath(secondPath)).toBe("");
		}
	});

	it("handles trailing separators and paths without parent folder", () => {
		const firstPath = "/alpha/beta/" as string;
		const secondPath = "/alpha" as string;

		expect(DPath.is(firstPath)).toBe(true);
		expect(DPath.is(secondPath)).toBe(true);

		if (DPath.is(firstPath) && DPath.is(secondPath)) {
			expect(DPath.getParentFolderPath(firstPath)).toBe("/alpha");
			expect(DPath.getParentFolderPath(secondPath)).toBe("");
		}
	});

	it("returns an empty string when the parent folder cannot be found", () => {
		const path = "/" as string;

		expect(DPath.is(path)).toBe(true);

		if (DPath.is(path)) {
			expect(DPath.getParentFolderPath(path)).toBe("");
		}
	});

	it("narrows the output when the input is a path", () => {
		const path = "alpha/beta/gamma" as string;

		if (DPath.is(path)) {
			const result = DPath.getParentFolderPath(path);

			expect(result).toBe("alpha/beta");

			type _CheckResult = ExpectType<
				typeof result,
				string,
				"strict"
			>;
		}
	});

	it("narrows the output when the input is an absolute path", () => {
		const path = "/alpha/beta/gamma" as string;

		if (DPath.isAbsolute(path)) {
			const result = DPath.getParentFolderPath(path);

			expect(result).toBe("/alpha/beta");

			type _CheckResult = ExpectType<
				typeof result,
				string,
				"strict"
			>;
		}
	});

	it("requires a path input", () => {
		const path = "alpha/beta" as string;

		// @ts-expect-error path must be validated before extraction.
		expect(DPath.getParentFolderPath(path)).toBe("alpha");
	});

	it("can be used directly in a pipe", () => {
		const path = "alpha/beta" as string;

		expect(DPath.is(path)).toBe(true);

		if (DPath.is(path)) {
			const result = pipe(
				path,
				DPath.getParentFolderPath,
			);

			expect(result).toBe("alpha");

			type _CheckResult = ExpectType<
				typeof result,
				string,
				"strict"
			>;
		}
	});
});
