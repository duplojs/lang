import { describe, expect, it } from "vitest";
import { DS, DEither, type ExpectType } from "@scripts";

describe("email", () => {
	it("creates an email constraint", () => {
		const constraint = DS.email();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DS.EmailConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DS.ConstraintValue<typeof constraint>,
			`${string}@${string}.${string}`,
			"strict"
		>;

		expect(constraint.definition).toEqual({ regex: DS.emailRegex });
		expect(constraint.executeCheck("user@example.com")).toBe(DS.SuccessSymbol);
		expect(constraint.executeCheck("user@example")).toBe(DS.ErrorSymbol);
	});

	it("can constrain a string helper inside nested object helpers", () => {
		const structure = DS.object({
			user: DS.object({
				email: DS.string([DS.email()]),
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
			DS.StructureValue<typeof structure>,
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
