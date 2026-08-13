import { DCommon, type ExpectType } from "@scripts";

describe("addWrappedProperties", () => {
	it("adds computed properties to a wrapped value", () => {
		const wrappedValue = DCommon.wrapValue("Jane" as const);
		const result = DCommon.addWrappedProperties(
			wrappedValue,
			(params) => ({
				length: DCommon.unwrap(params.wrappedValue).length,
			}),
		);

		type _CheckResult = ExpectType<
			typeof result,
			typeof wrappedValue & {
				length: number;
			},
			"strict"
		>;

		expect(DCommon.unwrap(result)).toBe("Jane");
		expect(result.length).toBe(4);
	});
});
