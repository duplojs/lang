import { DDataStructure, type ExpectType } from "@scripts";

describe("UndefinedType", () => {
	it("creates a synchronous undefined type", () => {
		const type = DDataStructure.UndefinedType();

		type _CheckType = ExpectType<
			typeof type,
			DDataStructure.UndefinedType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DDataStructure.TypeValue<typeof type>,
			undefined,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DDataStructure.TheUndefined);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts undefined values", () => {
		const type = DDataStructure.UndefinedType();

		expect(type.executeCheck(undefined)).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects non-undefined values through its fundamental type", () => {
		const type = DDataStructure.UndefinedType();
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(type.executeCheck(null, errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DDataStructure.TheUndefined);
	});
});
