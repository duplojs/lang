import { DString, pipe, type ExpectType } from "@scripts";

describe("includes", () => {
	it("should validate contained text", () => {
		expect(DString.includes("hello world", "world")).toBe(true);
		expect(DString.includes("hello world", "duplo")).toBe(false);
	});

	it("should validate contained text in pipe", () => {
		const result = pipe(
			"hello world",
			DString.includes("world"),
		);

		expect(result).toBe(true);
	});

	it("should narrow a string union to values containing the search string", () => {
		const source = "api-user" as "api-user" | "admin";

		if (DString.includes(source, "api")) {
			type _CheckSource = ExpectType<
				typeof source,
				"api-user",
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				"admin",
				"strict"
			>;
		}
	});
});
