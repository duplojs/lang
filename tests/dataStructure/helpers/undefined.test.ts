import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("undefined", () => {
	it("creates an undefined type structure", () => {
		const structure = DDataStructure.undefined();
		const success = structure.check(undefined);
		const failure = structure.check(null);

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.TypeStructure<undefined, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			undefined,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DDataStructure.TheUndefined);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", undefined));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: null,
			path: "",
		});
	});

	it("can be used inside object helpers and array helpers", () => {
		const structure = DDataStructure.object({
			state: DDataStructure.object({
				missing: DDataStructure.undefined(),
				items: DDataStructure.array(DDataStructure.undefined()),
			}),
		});
		const input = {
			state: {
				missing: undefined,
				items: [undefined, undefined],
			},
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly state: {
					readonly missing?: undefined;
					readonly items: readonly undefined[];
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
