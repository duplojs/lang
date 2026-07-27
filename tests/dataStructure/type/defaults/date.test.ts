import { DChrono, DDataStructure, type ExpectType } from "@scripts";

describe("DateType", () => {
	it("creates a synchronous date type", () => {
		const type = DDataStructure.DateType();

		type _CheckType = ExpectType<
			typeof type,
			DDataStructure.DateType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DDataStructure.TypeValue<typeof type>,
			DChrono.TheDate,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DDataStructure.TheDate);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts chrono date values", () => {
		const type = DDataStructure.DateType();

		expect(type.executeCheck(DChrono.TheDate.new(0))).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects non-chrono date values through its fundamental type", () => {
		const type = DDataStructure.DateType();
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(type.executeCheck(new Date(0), errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DDataStructure.TheDate);
	});
});
