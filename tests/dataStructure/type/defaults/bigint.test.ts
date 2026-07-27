import { DDataStructure, type ExpectType } from "@scripts";

describe("BigintType", () => {
	it("creates a synchronous bigint type", () => {
		const type = DDataStructure.BigintType();

		type _CheckType = ExpectType<
			typeof type,
			DDataStructure.BigintType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DDataStructure.TypeValue<typeof type>,
			bigint,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DDataStructure.TheBigint);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts bigint values", () => {
		const type = DDataStructure.BigintType();

		expect(type.executeCheck(12n)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects non-bigint values through its fundamental type", () => {
		const type = DDataStructure.BigintType();
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(type.executeCheck(12, errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DDataStructure.TheBigint);
	});
});
