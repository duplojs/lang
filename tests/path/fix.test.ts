import { DPath, type ExpectType } from "@scripts";

describe("fix", () => {
	it("removes one trailing separator and one leading relative marker", () => {
		const result = DPath.fix("./project/src/");

		expect(result).toBe("project/src");

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("keeps paths without a supported normalization marker unchanged", () => {
		expect(DPath.fix("project/src")).toBe("project/src");
		expect(DPath.fix("../project/src")).toBe("../project/src");
	});

	it("uses the same minimal normalization as relative computation", () => {
		expect(DPath.fix("/")).toBe("");
		expect(DPath.fix("./")).toBe(".");
		expect(DPath.fix("project/src//")).toBe("project/src/");
	});
});
