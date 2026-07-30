import { DEither, pipe, type ExpectType } from "@scripts";

describe("whenIsSelected", () => {
	it("should map selected information and keep unselected values", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);

		const result = DEither.whenIsSelected(
			input,
			{
				success: true,
				error: false,
			},
			(value) => {
				expect(value).toBe(42);
				return 84;
			},
		);

		expect(result).toBe(84);

		type _CheckResult = ExpectType<
			typeof result,
			84 | DEither.Error<"message">,
			"strict"
		>;
	});

	it("should map selected information in pipe", () => {
		const input = (
			Math.random() > -1
				? DEither.error("message")
				: DEither.success(42)
		);

		const result = pipe(
			input,
			DEither.whenIsSelected(
				{
					success: false,
					error: true,
				},
				(value) => {
					expect(value).toBe("message");
					return "MESSAGE";
				},
			),
		);

		expect(result).toBe("MESSAGE");

		type _CheckResult = ExpectType<
			typeof result,
			"MESSAGE" | DEither.Success<42>,
			"strict"
		>;
	});

	it("should keep non either values unchanged", () => {
		const result = DEither.whenIsSelected(
			"plain",
			{} as never,
			(value) => value,
		);

		expect(result).toBe("plain");
	});
});
