import { DDataStructure, DEither, type DString, type ExpectType } from "@scripts";

describe("string", () => {
	it("creates a string type structure", () => {
		const structure = DDataStructure.string();
		const success = structure.check("value");
		const failure = structure.check(12);

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.TypeStructure<string, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DDataStructure.TheString);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", "value"));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: 12,
			path: "",
		});
	});

	it("preserves constraint output inside nested object helpers", () => {
		const structure = DDataStructure.object({
			user: DDataStructure.object({
				email: DDataStructure.string([DDataStructure.email()]),
				name: DDataStructure.string([DDataStructure.minCharacters(3)]),
			}),
		});
		const input = {
			user: {
				email: "jane@example.com",
				name: "Jane",
			},
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly user: {
					readonly email: `${string}@${string}.${string}`;
					readonly name: string & DString.MinCharacters<3>;
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
