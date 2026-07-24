import { describe, expect, it } from "vitest";
import { DS, DEither, type ExpectType } from "@scripts";

describe("bigint", () => {
	it("creates a bigint type structure", () => {
		const structure = DS.bigint();
		const success = structure.check(12n);
		const failure = structure.check(12);

		type _CheckStructure = ExpectType<
			typeof structure,
			DS.TypeStructure<DS.BigintType, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			bigint,
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DS.TheBigint);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", 12n));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: 12,
			path: "",
		});
	});

	it("can be used inside nested object helpers", () => {
		const structure = DS.object({
			user: DS.object({
				balance: DS.bigint(),
			}),
		});
		const input = {
			user: {
				balance: 120n,
			},
		};

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			{
				readonly user: {
					readonly balance: bigint;
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
