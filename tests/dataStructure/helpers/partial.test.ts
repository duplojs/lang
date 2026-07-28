import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("partial", () => {
	it("makes every object property optional", () => {
		const structure = DDataStructure.partial(
			DDataStructure.object({
				name: DDataStructure.string(),
				age: DDataStructure.number(),
			}),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly name?: string;
				readonly age?: number;
			},
			"strict"
		>;

		expect(structure.check({})).toStrictEqual(
			DEither.right("check-success", {}),
		);
		expect(structure.check({ name: "Jane" })).toStrictEqual(
			DEither.right("check-success", { name: "Jane" }),
		);
		expect(structure.is({ name: undefined })).toBe(true);
	});

	it("keeps property constraints when adding undefined to a non-union structure", () => {
		const structure = DDataStructure.partial(
			DDataStructure.object({
				email: DDataStructure.string([DDataStructure.email()]),
			}),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly email?: `${string}@${string}.${string}` | undefined;
			},
			"strict"
		>;

		expect(structure.check({})).toStrictEqual(
			DEither.right("check-success", {}),
		);
		expect(structure.check({ email: "jane@example.com" })).toStrictEqual(
			DEither.right("check-success", { email: "jane@example.com" }),
		);
		expect(structure.is({ email: "not-an-email" })).toBe(false);
	});

	it("does not add undefined twice inside an existing union", () => {
		const structure = DDataStructure.partial(
			DDataStructure.object({
				value: DDataStructure.optional(
					DDataStructure.string(),
				),
			}),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly value?: string | undefined;
			},
			"strict"
		>;

		expect(
			(structure.definition.shape.value[0]!.value as DDataStructure.UnionStructure)
				.definition.values,
		).toHaveLength(2);
		expect(structure.check({})).toStrictEqual(
			DEither.right("check-success", {}),
		);
	});

	it("keeps an undefined structure unchanged", () => {
		const structure = DDataStructure.partial(
			DDataStructure.object({
				value: DDataStructure.undefined(),
			}),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly value?: undefined;
			},
			"strict"
		>;

		expect("values" in structure.definition.shape.value[0]!.value.definition).toBe(false);
		expect(structure.check({})).toStrictEqual(
			DEither.right("check-success", {}),
		);
	});
});
