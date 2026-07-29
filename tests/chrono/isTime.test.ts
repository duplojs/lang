import { DChrono, type ExpectType } from "@scripts";

describe("isTime", () => {
	it("returns true for valid TheTime values", () => {
		const valid = DChrono.createTimeOrThrow(12345);

		expect(DChrono.isTime(valid)).toBe(true);
		expect(DChrono.isTime(DChrono.createTimeOrThrow(-12345))).toBe(true);

		if (DChrono.isTime(valid)) {
			type Check = ExpectType<
				typeof valid,
				DChrono.TheTime,
				"strict"
			>;
		}
	});

	it("returns false for invalid strings", () => {
		expect(DChrono.isTime("not-a-time")).toBe(false);
		expect(DChrono.isTime("time-+")).toBe(false);
	});
});
