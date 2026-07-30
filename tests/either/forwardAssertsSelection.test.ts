import { DEither, pipe, type ExpectType } from "@scripts";

describe("forwardAssertsSelection", () => {
	it("should forward selected either values", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);

		const result = DEither.forwardAssertsSelection(
			input,
			{
				success: true,
				error: false,
			},
		);

		expect(result).toBe(input);

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Success<42>,
			"strict"
		>;
	});

	it("should forward selected either values in pipe", () => {
		const input = DEither.error("message");
		const result = pipe(
			input,
			DEither.forwardAssertsSelection({
				error: true,
			}),
		);

		expect(result).toBe(input);

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Error<"message">,
			"strict"
		>;
	});

	it("should throw when the either information is not selected", () => {
		const input = DEither.error("message");
		const selector = { error: false };

		expect(() => DEither.forwardAssertsSelection(input, selector))
			.toThrow(DEither.ForwardAssertsSelectionError);

		try {
			DEither.forwardAssertsSelection(input, selector);
		} catch (error) {
			expect(error).toBeInstanceOf(DEither.ForwardAssertsSelectionError);

			if (error instanceof DEither.ForwardAssertsSelectionError) {
				expect(error.message).toBe("Either information is not selected.");
				expect(error.value).toBe(input);
				expect(error.selector).toBe(selector);
			}
		}
	});
});
