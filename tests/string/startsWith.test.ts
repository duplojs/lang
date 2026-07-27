import { DString, pipe, type ExpectType } from "@scripts";

describe("startsWith", () => {
	it("should validate string start", () => {
		expect(DString.startsWith("api-user", "api")).toBe(true);
		expect(DString.startsWith("admin", "api")).toBe(false);
	});

	it("should validate string start in pipe", () => {
		const result = pipe(
			"api-user",
			DString.startsWith("api"),
		);

		expect(result).toBe(true);
	});

	it("should narrow a string union to values starting with the search string", () => {
		const source = "api-user" as "api-user" | "admin";

		if (DString.startsWith(source, "api")) {
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
