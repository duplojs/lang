import { DDataStructure, DModeling, type DString, type ExpectType } from "@scripts";

describe("createNewEntity", () => {
	it("creates a capitalized new type with optional constraints", () => {
		const structure = DModeling.createNewEntity(
			"UserName",
			DDataStructure.string(),
			[DDataStructure.stringMin(3)],
		);

		type _CheckStructure = ExpectType<
			typeof structure,
			DModeling.NewTypeStructure<
				"UserName",
				string,
				readonly [DDataStructure.StringMinConstraint<3>]
			>,
			"strict"
		>;
		type _CheckValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string & DModeling.NewType<"UserName", DString.MinCharacters<3>>,
			"strict"
		>;

		expect(structure.name).toBe("UserName");
		expect(structure.executeCheck("Jane")).toBe(DDataStructure.SuccessSymbol);
		expect(structure.executeCheck("Jo")).toBe(DDataStructure.ErrorSymbol);
	});

	it("uses no new type constraint by default", () => {
		const structure = DModeling.createNewEntity(
			"UserAge",
			DDataStructure.number(),
		);

		type _CheckStructure = ExpectType<
			typeof structure,
			DModeling.NewTypeStructure<"UserAge", number, readonly []>,
			"strict"
		>;

		expect(structure.definition.newTypeConstraints).toStrictEqual([]);
	});

	it("rejects an existing new type as its top-level structure", () => {
		const name = DModeling.createNewEntity("UserName", DDataStructure.string());

		// @ts-expect-error a NewType cannot be wrapped directly in another NewType.
		DModeling.createNewEntity("UserOtherName", name);
	});
});
