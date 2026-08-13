import { DCommon, type ExpectType } from "@scripts";

describe("unwrap", () => {
	it("extracts a wrapped value", () => {
		const wrappedValue = DCommon.wrapValue("value" as const);
		const result = DCommon.unwrap(wrappedValue);

		type _CheckResult = ExpectType<
			typeof result,
			"value",
			"strict"
		>;

		expect(result).toBe("value");
	});

	it("returns non-wrapped values unchanged", () => {
		expect(DCommon.unwrap("value")).toBe("value");
		expect(DCommon.unwrap(null)).toBeNull();
	});
});
