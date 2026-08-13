import { DCommon, type ExpectType } from "@scripts";

describe("unwrapGroup", () => {
	it("unwraps every wrapped property in a group", () => {
		const result = DCommon.unwrapGroup({
			name: DCommon.wrapValue("Jane" as const),
			count: 1 as const,
		});

		type _CheckResult = ExpectType<
			typeof result,
			{
				readonly name: "Jane";
				readonly count: 1;
			},
			"strict"
		>;

		expect(result).toStrictEqual({
			name: "Jane",
			count: 1,
		});
	});
});
