import { describe, expect, it } from "vitest";
import { DS, DEither, type ExpectType } from "@scripts";

describe("stringMin", () => {
	it("creates a string minimum constraint", () => {
		const constraint = DS.stringMin(3);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DS.StringMinConstraint<3>,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DS.ConstraintValue<typeof constraint>,
			string,
			"strict"
		>;

		expect(constraint.definition).toEqual({ min: 3 });
		expect(constraint.executeCheck("abc")).toBe(DS.SuccessSymbol);
		expect(constraint.executeCheck("ab")).toBe(DS.ErrorSymbol);
	});

	it("can constrain a string helper inside nested object helpers", () => {
		const structure = DS.object({
			user: DS.object({
				name: DS.string([DS.stringMin(3)]),
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
			DS.StructureValue<typeof structure>,
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
