import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("email", () => {
	it("creates an email constraint", () => {
		const constraint = DDataStructure.email();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.EmailConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			`${string}@${string}.${string}`,
			"strict"
		>;

		expect(constraint.definition).toEqual({ regex: DDataStructure.emailRegex });
		expect(constraint.executeCheck("user@example.com")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("user@example")).toBe(DDataStructure.ErrorSymbol);
	});

	it("can constrain a string helper inside nested object helpers", () => {
		const structure = DDataStructure.object({
			user: DDataStructure.object({
				email: DDataStructure.string([DDataStructure.email()]),
			}),
		});
		const input = {
			user: {
				email: "user@example.com",
			},
		};
		const invalidInput = {
			user: {
				email: "user@example",
			},
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly user: {
					readonly email: `${string}@${string}.${string}`;
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
			data: "user@example",
			path: "user.email",
		});
	});
});
