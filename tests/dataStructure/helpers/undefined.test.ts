import { describe, expect, it } from "vitest";
import { DS, DEither, type ExpectType } from "@scripts";

describe("undefined", () => {
	it("creates an undefined type structure", () => {
		const structure = DS.undefined();
		const success = structure.check(undefined);
		const failure = structure.check(null);

		type _CheckStructure = ExpectType<
			typeof structure,
			DS.TypeStructure<undefined, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			undefined,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DS.TheUndefined);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", undefined));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: null,
			path: "",
		});
	});

	it("can be used inside object helpers and array helpers", () => {
		const structure = DS.object({
			state: DS.object({
				missing: DS.undefined(),
				items: DS.array(DS.undefined()),
			}),
		});
		const input = {
			state: {
				missing: undefined,
				items: [undefined, undefined],
			},
		};

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			{
				readonly state: {
					readonly missing?: undefined;
					readonly items: readonly undefined[];
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
