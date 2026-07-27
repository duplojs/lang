import { DString, pipe, type ExpectType } from "@scripts";

describe("isIn", () => {
	it("should validate a string contained in an array", () => {
		const values = ["draft", "published"] as const;

		expect(DString.isIn("draft", values)).toBe(true);
		expect(DString.isIn("archived", values)).toBe(false);
	});

	it("should validate a string contained in an array in pipe", () => {
		const result = pipe(
			"draft",
			DString.isIn(["draft", "published"] as const),
		);

		expect(result).toBe(true);
	});

	it("should narrow the string to array values", () => {
		const source = "draft" as "draft" | "archived";

		if (DString.isIn(source, ["draft", "published"] as const)) {
			type _CheckSource = ExpectType<
				typeof source,
				"draft",
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				"archived",
				"strict"
			>;
		}
	});
});
