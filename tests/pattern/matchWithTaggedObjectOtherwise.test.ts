import { createTaggedObject, DPattern, pipe, type ExpectType, type ObjectTag } from "@scripts";

describe("matchWithTaggedObjectOtherwise", () => {
	interface Success extends ObjectTag<"success"> {
		value: number;
	}

	interface Failure extends ObjectTag<"failure"> {
		error: string;
	}

	type Input = Success | Failure;

	it("should match a handled tagged object and narrow both callbacks", () => {
		const input = createTaggedObject("success", {
			value: 42,
		}) as Input;

		const result = DPattern.matchWithTaggedObjectOtherwise(input, {
			success: (value) => {
				type check = ExpectType<
					typeof value,
					Success,
					"strict"
				>;

				return value.value;
			},
		}, (value) => {
			type check = ExpectType<
				typeof value,
				Failure,
				"strict"
			>;

			return value.error;
		});

		expect(result).toBe(42);

		type check = ExpectType<
			typeof result,
			number | string,
			"strict"
		>;
	});

	it("should delegate an unhandled tagged object in pipe", () => {
		const input = createTaggedObject("failure", {
			error: "failed",
		}) as Input;

		const result = pipe(
			input,
			DPattern.matchWithTaggedObjectOtherwise({
				success: (value) => {
					type check = ExpectType<
						typeof value,
						Success,
						"strict"
					>;

					return value.value;
				},
			}, (value) => {
				type check = ExpectType<
					typeof value,
					Failure,
					"strict"
				>;

				return value.error;
			}),
		);

		expect(result).toBe("failed");

		type check = ExpectType<
			typeof result,
			number | string,
			"strict"
		>;
	});

	it("should reject matcher keys outside the input tags", () => {
		const input = createTaggedObject("success", {
			value: 42,
		}) as Input;

		DPattern.matchWithTaggedObjectOtherwise(
			input,
			// @ts-expect-error matcher cannot contain unknown tagged object cases
			{
				success: () => 42,
				unexpected: () => false,
			},
			() => "fallback",
		);

		expect(true).toBe(true);
	});
});
