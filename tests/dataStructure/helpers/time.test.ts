import { describe, expect, it } from "vitest";
import { DChrono, DS, DEither, type ExpectType } from "@scripts";

describe("time", () => {
	it("creates a time type structure", () => {
		const structure = DS.time();
		const value = DChrono.TheTime.new(0);
		const success = structure.check(value);
		const failure = structure.check(0);

		type _CheckStructure = ExpectType<
			typeof structure,
			DS.TypeStructure<DS.TimeType, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			DChrono.TheTime,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DS.TheTime);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", value));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: 0,
			path: "",
		});
	});

	it("can be used inside object helpers and array helpers", () => {
		const structure = DS.object({
			schedule: DS.object({
				openAt: DS.time(),
				slots: DS.array(DS.time()),
			}),
		});
		const input = {
			schedule: {
				openAt: DChrono.TheTime.new(0),
				slots: [
					DChrono.TheTime.new(1),
					DChrono.TheTime.new(2),
				],
			},
		};

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			{
				readonly schedule: {
					readonly openAt: DChrono.TheTime;
					readonly slots: readonly DChrono.TheTime[];
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
