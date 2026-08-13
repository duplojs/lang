import { DCommon, type ExpectType } from "@scripts";

describe("toWrappedValue", () => {
	it("wraps non-wrapped values", () => {
		const result = DCommon.toWrappedValue("value" as const);

		type _CheckResult = ExpectType<
			typeof result,
			DCommon.WrappedValue<"value">,
			"strict"
		>;

		expect(DCommon.unwrap(result)).toBe("value");
	});

	it("keeps already wrapped values unchanged", () => {
		const input = DCommon.wrapValue("value" as const);
		const result = DCommon.toWrappedValue(input);

		expect(result).toBe(input);
	});
});
