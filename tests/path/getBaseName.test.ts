import { DPath, pipe, type ExpectType } from "@scripts";

describe("getBaseName", () => {
	it("returns the base name of paths", () => {
		const firstPath = "/alpha/beta/file.txt" as string;
		const secondPath = "beta/file.txt" as string;
		const thirdPath = "file.txt" as string;

		expect(DPath.is(firstPath)).toBe(true);
		expect(DPath.is(secondPath)).toBe(true);
		expect(DPath.is(thirdPath)).toBe(true);

		if (DPath.is(firstPath) && DPath.is(secondPath) && DPath.is(thirdPath)) {
			expect(DPath.getBaseName(firstPath)).toBe("file.txt");
			expect(DPath.getBaseName(secondPath)).toBe("file.txt");
			expect(DPath.getBaseName(thirdPath)).toBe("file.txt");
		}
	});

	it("returns the base name of paths with trailing separators", () => {
		const firstPath = "/alpha/beta/" as string;
		const secondPath = "/alpha/beta///" as string;

		expect(DPath.is(firstPath)).toBe(true);
		expect(DPath.is(secondPath)).toBe(true);

		if (DPath.is(firstPath) && DPath.is(secondPath)) {
			expect(DPath.getBaseName(firstPath)).toBe("beta");
			expect(DPath.getBaseName(secondPath)).toBe("beta");
		}
	});

	it("removes the extension when requested", () => {
		const path = "/alpha/beta/file.txt" as string;

		expect(DPath.is(path)).toBe(true);

		if (DPath.is(path)) {
			expect(
				DPath.getBaseName(path, { removeExtension: true }),
			).toBe("file");
			expect(
				DPath.getBaseName(path, { removeExtension: false }),
			).toBe("file.txt");
		}
	});

	it("returns an empty base name for root paths", () => {
		const path = "/" as string;

		expect(DPath.is(path)).toBe(true);

		if (DPath.is(path)) {
			expect(DPath.getBaseName(path)).toBe("");
		}
	});

	it("narrows the output when the input is a path", () => {
		const path = "/alpha/beta/file.txt" as string;

		if (DPath.is(path)) {
			const result = DPath.getBaseName(path);

			expect(result).toBe("file.txt");

			type _CheckResult = ExpectType<
				typeof result,
				string,
				"strict"
			>;
		}
	});

	it("keeps a wide output when the extension is removed", () => {
		const path = "/alpha/beta/.env" as string;

		if (DPath.is(path)) {
			const result = DPath.getBaseName(path, { removeExtension: true });

			expect(result).toBe("");

			type _CheckResult = ExpectType<
				typeof result,
				string,
				"strict"
			>;
		}
	});

	it("requires a path input", () => {
		const path = "/alpha/beta/file.txt" as string;

		// @ts-expect-error path must be validated before extraction.
		expect(DPath.getBaseName(path)).toBe("file.txt");
	});

	it("can be used directly in a pipe", () => {
		const path = "/alpha/beta/file.txt" as string;

		expect(DPath.is(path)).toBe(true);

		if (DPath.is(path)) {
			const result = pipe(
				path,
				DPath.getBaseName,
			);

			expect(result).toBe("file.txt");

			type _CheckResult = ExpectType<
				typeof result,
				string,
				"strict"
			>;
		}
	});
});
