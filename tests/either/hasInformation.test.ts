import { DEither, pipe, type ExpectType } from "@scripts";

describe("hasInformation", () => {
	it("should check one information or multiple informations", () => {
		const input = DEither.right("created", 42);

		expect(DEither.hasInformation(input, "created")).toBe(true);
		expect(DEither.hasInformation(input, ["created"])).toBe(true);
		expect(DEither.hasInformation(input, ["missing", "created"] as never)).toBe(true);
		expect(DEither.hasInformation(input, "missing" as never)).toBe(false);
		expect(DEither.hasInformation({ value: 42 }, "created" as never)).toBe(false);
	});

	it("should check information in pipe and narrow the input", () => {
		const input = (
			Math.random() > -1
				? DEither.right("created", 42)
				: DEither.error("message")
		);

		const result = pipe(
			input,
			DEither.hasInformation("created"),
		);

		expect(result).toBe(true);

		if (DEither.hasInformation(input, "created")) {
			type _CheckInput = ExpectType<
				typeof input,
				DEither.Right<"created", 42>,
				"strict"
			>;
		}
	});
});
