import { DChrono, DDataStructure, type ExpectType } from "@scripts";

describe("TimeType", () => {
	it("creates a synchronous time type", () => {
		const type = DDataStructure.TimeType();

		type _CheckType = ExpectType<
			typeof type,
			DDataStructure.TimeType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DDataStructure.TypeValue<typeof type>,
			DChrono.TheTime,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DDataStructure.TheTime);
		expect(type.definition).toEqual({});
		expect(type.isAsynchronous()).toBe(false);
	});

	it("accepts chrono time values", () => {
		const type = DDataStructure.TimeType();

		expect(type.executeCheck(DChrono.TheTime.new(0))).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects non-chrono time values through its fundamental type", () => {
		const type = DDataStructure.TimeType();
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(type.executeCheck(0, errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(DDataStructure.TheTime);
	});
});
