import { describe, expect, it } from "vitest";
import { DS, type ExpectType } from "@scripts";

describe("BigintLiteralType", () => {
	it("creates a synchronous bigint literal type", () => {
		const type = DS.BigintLiteralType(12n);

		type _CheckType = ExpectType<
			typeof type,
			DS.BigintLiteralType<12n>,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DS.TypeValue<typeof type>,
			12n,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DS.TheBigint);
		expect(type.definition).toEqual({ value: 12n });
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts its literal value", () => {
		const type = DS.BigintLiteralType(12n);

		expect(type.executeCheck(12n)).toBe(DS.SuccessSymbol);
	});

	it("rejects non-bigint values through its fundamental type", () => {
		const type = DS.BigintLiteralType(12n);
		const errorHandler = DS.createGetErrorHandler();

		expect(type.executeCheck(12, errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DS.TheBigint);
	});

	it("rejects another bigint value through its literal type", () => {
		const type = DS.BigintLiteralType(12n);
		const errorHandler = DS.createGetErrorHandler();

		expect(type.executeCheck(24n, errorHandler)).toBe(DS.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(type);
	});
});
