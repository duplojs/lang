import { DPath, pipe, type ExpectType } from "@scripts";

describe("isAbsolute", () => {
	it("validates safe absolute posix paths", () => {
		expect(DPath.isAbsolute("/usr/local")).toBe(true);
		expect(DPath.isAbsolute("/truc/..ttot/tr.ts")).toBe(true);
		expect(DPath.isAbsolute("/foo/.../bar")).toBe(true);
		expect(DPath.isAbsolute("/")).toBe(true);
	});

	it("rejects relative paths, malformed paths and parent traversal segments", () => {
		expect(DPath.isAbsolute("relative/path")).toBe(false);
		expect(DPath.isAbsolute("")).toBe(false);
		expect(DPath.isAbsolute("///")).toBe(false);
		expect(DPath.isAbsolute("..")).toBe(false);
		expect(DPath.isAbsolute("../root")).toBe(false);
		expect(DPath.isAbsolute("/foo/../bar")).toBe(false);
	});

	it("narrows a string with path and absolute constraints", () => {
		const path = "/root" as string;

		if (DPath.isAbsolute(path)) {
			type _CheckPath = ExpectType<
				typeof path,
				string & DPath.Path & DPath.Absolute,
				"strict"
			>;
		} else {
			type _CheckPath = ExpectType<
				typeof path,
				string,
				"strict"
			>;
		}
	});

	it("can be used directly in a pipe", () => {
		const result = pipe("/root", DPath.isAbsolute);

		expect(result).toBe(true);

		type _CheckResult = ExpectType<
			typeof result,
			boolean,
			"strict"
		>;
	});
});
