import { DEither, pipe, type ExpectType } from "@scripts";

describe("whenIsSelectedOtherwise", () => {
	it("should call the selected callback and type the otherwise value", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);

		const result = DEither.whenIsSelectedOtherwise(
			input,
			{
				success: true,
				error: false,
			},
			(value) => {
				expect(value).toBe(42);
				return 84;
			},
			(value) => {
				type _CheckValue = ExpectType<
					typeof value,
					DEither.Error<"message">,
					"strict"
				>;

				return value;
			},
		);

		expect(result).toBe(84);

		type _CheckResult = ExpectType<
			typeof result,
			84 | DEither.Error<"message">,
			"strict"
		>;
	});

	it("should call otherwise for unselected information in pipe", () => {
		const input = DEither.error("message");
		const result = pipe(
			input,
			DEither.whenIsSelectedOtherwise(
				{
					error: false,
				},
				(value) => value,
				(value) => DEither.unwrapLeft(value),
			),
		);

		expect(result).toBe("message");
	});
});
