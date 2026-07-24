import { describe, expect, it } from "vitest";
import { DS, DEither, type ExpectType } from "@scripts";

describe("string", () => {
	it("creates a string type structure", () => {
		const structure = DS.string();
		const success = structure.check("value");
		const failure = structure.check(12);

		type _CheckStructure = ExpectType<
			typeof structure,
			DS.TypeStructure<DS.StringType, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			string,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DS.TheString);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", "value"));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: 12,
			path: "",
		});
	});

	it("preserves constraint output inside nested object helpers", () => {
		const structure = DS.object({
			user: DS.object({
				email: DS.string([DS.email()]),
				name: DS.string([DS.stringMin(3)]),
			}),
		});
		const input = {
			user: {
				email: "jane@example.com",
				name: "Jane",
			},
		};

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			{
				readonly user: {
					readonly email: `${string}@${string}.${string}`;
					readonly name: string;
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
