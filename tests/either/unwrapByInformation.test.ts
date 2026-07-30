import { DEither, pipe, type ExpectType } from "@scripts";

describe("unwrapByInformation", () => {
	it("should unwrap matching information and keep other values", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);

		const result = DEither.unwrapByInformation(input, "success");

		expect(result).toBe(42);

		type _CheckResult = ExpectType<
			typeof result,
			42 | DEither.Error<"message">,
			"strict"
		>;
	});

	it("should unwrap multiple matching informations in pipe", () => {
		const input = (
			Math.random() > -1
				? DEither.error("message")
				: DEither.success(42)
		);

		const result = pipe(
			input,
			DEither.unwrapByInformation(["success", "error"]),
		);

		expect(result).toBe("message");

		type _CheckResult = ExpectType<
			typeof result,
			42 | "message",
			"strict"
		>;
	});

	it("should keep plain inputs unchanged", () => {
		const result = DEither.unwrapByInformation("plain", "success" as never);

		expect(result).toBe("plain");
	});
});
