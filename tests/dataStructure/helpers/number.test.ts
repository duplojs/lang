import { describe, expect, it } from "vitest";
import { DS, DEither, type ExpectType } from "@scripts";

describe("number", () => {
	it("creates a number type structure", () => {
		const structure = DS.number();
		const success = structure.check(12);
		const failure = structure.check("12");

		type _CheckStructure = ExpectType<
			typeof structure,
			DS.TypeStructure<DS.NumberType, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			number,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DS.TheNumber);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", 12));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: "12",
			path: "",
		});
	});

	it("can be used inside nested object helpers", () => {
		const structure = DS.object({
			user: DS.object({
				age: DS.number(),
			}),
		});
		const input = {
			user: {
				age: 30,
			},
		};

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			{
				readonly user: {
					readonly age: number;
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
