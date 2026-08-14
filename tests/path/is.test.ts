import { DPath, type ExpectType } from "@scripts";

describe("is", () => {
	it("validates posix paths", () => {
		expect(DPath.is("relative/path")).toBe(true);
		expect(DPath.is("/usr/local")).toBe(true);
		expect(DPath.is("/truc/..ttot/tr.ts")).toBe(true);
		expect(DPath.is("/foo/.../bar")).toBe(true);
		expect(DPath.is("/")).toBe(true);
		expect(DPath.is("..")).toBe(true);
		expect(DPath.is("../root")).toBe(true);
		expect(DPath.is("foo/../bar")).toBe(true);
		expect(DPath.is("/foo/../bar")).toBe(true);
		expect(DPath.is("foo/..")).toBe(true);
	});

	it("rejects empty paths and malformed posix separators", () => {
		expect(DPath.is("")).toBe(false);
		expect(DPath.is("///")).toBe(false);
		expect(DPath.is("foo//bar")).toBe(false);
	});

	it("narrows a string with a path constraint", () => {
		const path = "relative/path" as string;

		if (DPath.is(path)) {
			type _CheckPath = ExpectType<
				typeof path,
				string & DPath.Path,
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
});
