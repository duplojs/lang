import { describe, expect, it } from "vitest";
import { DS, DEither, type ExpectType } from "@scripts";

describe("array", () => {
	it("creates an array structure from an element structure", () => {
		const structure = DS.array(DS.string());
		const success = structure.check(["Jane", "John"]);
		const failure = structure.check(["Jane", 12]);

		type _CheckStructure = ExpectType<
			typeof structure,
			DS.ArrayStructure<readonly string[], readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			readonly string[],
			"strict"
		>;

		expect(structure.definition.constraints).toStrictEqual([]);
		expect(structure.definition.element.check("value")).toStrictEqual(
			DEither.right("check-success", "value"),
		);
		expect(success).toStrictEqual(
			DEither.right("check-success", ["Jane", "John"]),
		);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: 12,
			path: "[array: 1]",
		});
	});

	it("can be used inside object helpers and nested array helpers", () => {
		const structure = DS.object({
			user: DS.object({
				tags: DS.array(DS.string()),
				groups: DS.array(DS.array(DS.number())),
			}),
		});
		const input = {
			user: {
				tags: ["admin", "member"],
				groups: [[1, 2], [3]],
			},
		};

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			{
				readonly user: {
					readonly tags: readonly string[];
					readonly groups: readonly (readonly number[])[];
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
