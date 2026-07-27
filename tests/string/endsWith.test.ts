import { DString, pipe, type ExpectType } from "@scripts";

describe("endsWith", () => {
	it("should validate string end", () => {
		expect(DString.endsWith("user-api", "api")).toBe(true);
		expect(DString.endsWith("admin", "api")).toBe(false);
	});

	it("should validate string end in pipe", () => {
		const result = pipe(
			"user-api",
			DString.endsWith("api"),
		);

		expect(result).toBe(true);
	});

	it("should narrow a string union to values ending with the search string", () => {
		const source = "user-api" as "user-api" | "admin";

		if (DString.endsWith(source, "api")) {
			type _CheckSource = ExpectType<
				typeof source,
				"user-api",
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
