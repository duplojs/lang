import { DCommon, type ExpectType } from "@scripts";

describe("wrapValue", () => {
	it("wraps a value and detects wrapped values", () => {
		const result = DCommon.wrapValue("value" as const);

		type _CheckResult = ExpectType<
			typeof result,
			DCommon.WrappedValue<"value">,
			"strict"
		>;

		expect(DCommon.isWrappedValue(result)).toBe(true);
		expect(DCommon.unwrap(result)).toBe("value");

		const unwrapOrReturn = (input: DCommon.WrappedValue<"value"> | "raw") => {
			if (DCommon.isWrappedValue(input)) {
				type _CheckInput = ExpectType<
					typeof input,
					DCommon.WrappedValue<"value">,
					"strict"
				>;

				return DCommon.unwrap(input);
			} else {
				type _CheckInput = ExpectType<
					typeof input,
					"raw",
					"strict"
				>;

				return input;
			}
		};

		expect(unwrapOrReturn(result)).toBe("value");
		expect(unwrapOrReturn("raw")).toBe("raw");
	});

	it("rejects non-wrapped values", () => {
		expect(DCommon.isWrappedValue(null)).toBe(false);
		expect(DCommon.isWrappedValue("value")).toBe(false);
		expect(DCommon.isWrappedValue({ value: "test" })).toBe(false);
	});

	it("detects runtime wrapped value keys", () => {
		expect(DCommon.isRuntimeWrappedValueKey("@duplojs/lang/value")).toBe(true);
		expect(DCommon.isRuntimeWrappedValueKey("value")).toBe(false);
	});
});
