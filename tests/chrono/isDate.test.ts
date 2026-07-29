import { DChrono, type ExpectType } from "@scripts";

describe("DChrono.isDate", () => {
	it("returns true for valid TheDate strings", () => {
		const valid = DChrono.createDateOrThrow(1700000000);
		expect(DChrono.isDate(valid)).toBe(true);

		if (DChrono.isDate(valid)) {
			type Check = ExpectType<
				typeof valid,
				DChrono.TheDate,
				"strict"
			>;
		}
	});

	it("returns false for invalid strings", () => {
		expect(DChrono.isDate("not-a-date")).toBe(false);
		expect(DChrono.isDate("date-+")).toBe(false);
	});
});
