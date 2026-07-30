import { DString, pipe, when, type ExpectType } from "@scripts";

describe("containsOnly", () => {
	it("should validate characters from one range", () => {
		expect(DString.containsOnly("azerty", "a-z")).toBe(true);
		expect(DString.containsOnly("Azerty", "a-z")).toBe(false);
	});

	it("should validate characters from multiple ranges", () => {
		expect(DString.containsOnly("abc123", ["a-z", "0-9"])).toBe(true);
		expect(DString.containsOnly("abc-123", ["a-z", "0-9"])).toBe(false);
	});

	it("should narrow a string with a single range predicate outside pipe", () => {
		const source = "abc" as string;

		if (DString.containsOnly(source, "a-z")) {
			type _CheckSource = ExpectType<
				typeof source,
				string & DString.ContainsOnly<"a-z">,
				"strict"
			>;
		}
	});

	it("should narrow a string with multiple range predicate outside pipe", () => {
		const source = "abc123" as string;
		const predicate = DString.containsOnly(["a-z", "0-9"]);

		if (predicate(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				string & DString.ContainsOnly<"a-z" | "0-9">,
				"strict"
			>;
		}
	});

	it("should use a single range predicate in pipe with when", () => {
		const result = pipe(
			"abc",
			when(
				DString.containsOnly("a-z"),
				(value) => {
					type _CheckValue = ExpectType<
							typeof value,
							"abc" & DString.ContainsOnly<"a-z">,
							"strict"
					>;

					return "lowercase";
				},
			),
		);

		expect(result).toBe("lowercase");
	});

	it("should use a multiple range predicate in pipe with when", () => {
		const result = pipe(
			"ABC123",
			when(
				DString.containsOnly(["A-Z", "0-9"]),
				(value) => {
					type _CheckValue = ExpectType<
							typeof value,
							"ABC123" & DString.ContainsOnly<"A-Z" | "0-9">,
							"strict"
					>;

					return "uppercase-code";
				},
			),
		);

		expect(result).toBe("uppercase-code");
	});
});
