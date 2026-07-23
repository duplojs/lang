import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("BigintType", () => {
	it("creates a synchronous bigint type", () => {
		const type = DS.BigintType();

		type _CheckType = ExpectType<
			typeof type,
			DS.BigintType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DS.TypeValue<typeof type>,
			bigint,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DS.TheBigint);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts bigint values", () => {
		const type = DS.BigintType();

		expect(type.executeCheck(12n)).toBe(DS.SuccessSymbol);
	});

	it("rejects non-bigint values through its fundamental type", () => {
		const type = DS.BigintType();
		const errorHandler = DS.createGetErrorHandler();

		expect(type.executeCheck(12, errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheBigint);
	});
});
