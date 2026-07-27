import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("stringMin", () => {
	it("creates a string minimum constraint", () => {
		const constraint = DDataStructure.stringMin(3);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.StringMinConstraint<3>,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			string,
			"strict"
		>;

		expect(constraint.definition).toEqual({ min: 3 });
		expect(constraint.executeCheck("abc")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("ab")).toBe(DDataStructure.ErrorSymbol);
	});

	it("can constrain a string helper inside nested object helpers", () => {
		const structure = DDataStructure.object({
			user: DDataStructure.object({
				name: DDataStructure.string([DDataStructure.stringMin(3)]),
			}),
		});
		const input = {
			user: {
				name: "Jane",
			},
		};
		const invalidInput = {
			user: {
				name: "Jo",
			},
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly user: {
					readonly name: string;
				};
			},
			"strict"
		>;

		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.check(invalidInput),
				"check-error",
			).issues[0],
		).toMatchObject({
			data: "Jo",
			path: "user.name",
		});
	});
});
