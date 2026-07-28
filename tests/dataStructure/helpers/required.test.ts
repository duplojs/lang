import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("required", () => {
	it("makes every object property required", () => {
		const structure = DDataStructure.required(
			DDataStructure.object({
				name: DDataStructure.optional(
					DDataStructure.string(),
				),
				age: DDataStructure.optional(
					DDataStructure.number(),
				),
			}),
		);
		const input = {
			name: "Jane",
			age: 30,
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly name: string;
				readonly age: number;
			},
			"strict"
		>;

		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(structure.is({ name: "Jane" })).toBe(false);
		expect(structure.is({
			name: undefined,
			age: 30,
		})).toBe(false);
	});

	it("keeps a union only when more than one value remains", () => {
		const structure = DDataStructure.required(
			DDataStructure.object({
				alone: DDataStructure.optional(
					DDataStructure.string(),
				),
				multiple: DDataStructure.union([
					DDataStructure.string(),
					DDataStructure.number(),
					DDataStructure.undefined(),
				]),
			}),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly alone: string;
				readonly multiple: string | number;
			},
			"strict"
		>;

		expect("values" in structure.definition.shape.value[0]!.value.definition).toBe(false);
		expect(
			(structure.definition.shape.value[1]!.value as DDataStructure.UnionStructure)
				.definition.values,
		).toHaveLength(2);
		expect(structure.check({
			alone: "Jane",
			multiple: 30,
		})).toStrictEqual(
			DEither.right("check-success", {
				alone: "Jane",
				multiple: 30,
			}),
		);
	});

	it("keeps already required structures unchanged", () => {
		const structure = DDataStructure.required(
			DDataStructure.object({
				name: DDataStructure.string(),
				value: DDataStructure.union([
					DDataStructure.string(),
					DDataStructure.number(),
				]),
			}),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly name: string;
				readonly value: string | number;
			},
			"strict"
		>;

		expect("values" in structure.definition.shape.value[0]!.value.definition).toBe(false);
		expect(
			(structure.definition.shape.value[1]!.value as DDataStructure.UnionStructure)
				.definition.values,
		).toHaveLength(2);
		expect(structure.check({
			name: "Jane",
			value: "ok",
		})).toStrictEqual(
			DEither.right("check-success", {
				name: "Jane",
				value: "ok",
			}),
		);
	});
});
