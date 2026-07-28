import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("nullable", () => {
	it("keeps structure constraints when adding null to a non-union structure", () => {
		const structure = DDataStructure.nullable(
			DDataStructure.string([DDataStructure.email()]),
		);

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.UnionStructure<
				| `${string}@${string}.${string}`
				| null,
				readonly []
			>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			| `${string}@${string}.${string}`
			| null,
			"strict"
		>;

		expect(structure.definition.values).toHaveLength(2);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(structure.check(null)).toStrictEqual(
			DEither.right("check-success", null),
		);
		expect(structure.check("jane@example.com")).toStrictEqual(
			DEither.right("check-success", "jane@example.com"),
		);
		expect(structure.is("not-an-email")).toBe(false);
	});

	it("does not add null twice inside an existing union", () => {
		const structure = DDataStructure.nullable(
			DDataStructure.union([
				DDataStructure.null(),
				DDataStructure.string(),
			]),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string | null,
			"strict"
		>;

		expect(structure.definition.values).toHaveLength(2);
		expect(structure.check(null)).toStrictEqual(
			DEither.right("check-success", null),
		);
	});

	it("removes union constraints and keeps the initial value when adding null to a union", () => {
		const structure = DDataStructure.nullable(
			DDataStructure.union(
				[DDataStructure.string()],
				[DDataStructure.email()],
			),
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string | null,
			"strict"
		>;
		type _CheckConstraints = ExpectType<
			typeof structure.definition.constraints,
			readonly [],
			"strict"
		>;

		expect(structure.definition.values).toHaveLength(2);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(structure.check("not-an-email")).toStrictEqual(
			DEither.right("check-success", "not-an-email"),
		);
	});
});
