import { describe, expect, it } from "vitest";
import { DS, DEither, type ExpectType } from "@scripts";

describe("null", () => {
	it("creates a null type structure", () => {
		const structure = DS.null();
		const success = structure.check(null);
		const failure = structure.check(undefined);

		type _CheckStructure = ExpectType<
			typeof structure,
			DS.TypeStructure<DS.NullType, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			null,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DS.TheNull);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", null));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: undefined,
			path: "",
		});
	});

	it("can be used inside object helpers and array helpers", () => {
		const structure = DS.object({
			state: DS.object({
				empty: DS.null(),
				items: DS.array(DS.null()),
			}),
		});
		const input = {
			state: {
				empty: null,
				items: [null, null],
			},
		};

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			{
				readonly state: {
					readonly empty: null;
					readonly items: readonly null[];
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
