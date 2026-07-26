import { DS, DEither, type ExpectType } from "@scripts";

describe("boolean", () => {
	it("creates a boolean type structure", () => {
		const structure = DS.boolean();
		const success = structure.check(true);
		const failure = structure.check("true");

		type _CheckStructure = ExpectType<
			typeof structure,
			DS.TypeStructure<boolean, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			boolean,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DS.TheBoolean);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", true));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: "true",
			path: "",
		});
	});

	it("can be used inside nested object and array helpers", () => {
		const structure = DS.object({
			user: DS.object({
				active: DS.boolean(),
				flags: DS.array(DS.boolean()),
			}),
		});
		const input = {
			user: {
				active: true,
				flags: [true, false],
			},
		};

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			{
				readonly user: {
					readonly active: boolean;
					readonly flags: readonly boolean[];
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
