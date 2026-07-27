import { DChrono, DDataStructure, DEither, type ExpectType } from "@scripts";

describe("date", () => {
	it("creates a date type structure", () => {
		const structure = DDataStructure.date();
		const value = DChrono.TheDate.new(0);
		const success = structure.check(value);
		const failure = structure.check(new Date(0));

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.TypeStructure<DChrono.TheDate, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			DChrono.TheDate,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DDataStructure.TheDate);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", value));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: new Date(0),
			path: "",
		});
	});

	it("can be used inside object helpers and array helpers", () => {
		const structure = DDataStructure.object({
			calendar: DDataStructure.object({
				start: DDataStructure.date(),
				holidays: DDataStructure.array(DDataStructure.date()),
			}),
		});
		const input = {
			calendar: {
				start: DChrono.TheDate.new(0),
				holidays: [
					DChrono.TheDate.new(1),
					DChrono.TheDate.new(2),
				],
			},
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly calendar: {
					readonly start: DChrono.TheDate;
					readonly holidays: readonly DChrono.TheDate[];
				};
			},
			"strict"
		>;

		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(structure.is(input)).toBe(true);
	});
});
