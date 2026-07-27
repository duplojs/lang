import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("bigint", () => {
	it("creates a bigint type structure", () => {
		const structure = DDataStructure.bigint();
		const success = structure.check(12n);
		const failure = structure.check(12);

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.TypeStructure<bigint, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			bigint,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DDataStructure.TheBigint);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", 12n));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: 12,
			path: "",
		});
	});

	it("can be used inside nested object helpers", () => {
		const structure = DDataStructure.object({
			user: DDataStructure.object({
				balance: DDataStructure.bigint(),
			}),
		});
		const input = {
			user: {
				balance: 120n,
			},
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly user: {
					readonly balance: bigint;
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
