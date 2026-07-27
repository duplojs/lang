import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("literal", () => {
	it("creates a string literal type structure", () => {
		const structure = DDataStructure.literal("admin");
		const success = structure.check("admin");
		const failure = structure.check("member");

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.TypeStructure<"admin", readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			"admin",
			"strict"
		>;

		expect(structure.definition.type.fundamentalType).toBe(DDataStructure.TheString);
		expect(structure.definition.type.definition).toStrictEqual({ value: "admin" });
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", "admin"));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: "member",
			path: "",
		});
	});

	it("creates number bigint boolean undefined and null literal structures", () => {
		const numberStructure = DDataStructure.literal(12);
		const bigintStructure = DDataStructure.literal(12n);
		const booleanStructure = DDataStructure.literal(true);
		const undefinedStructure = DDataStructure.literal(undefined);
		const nullStructure = DDataStructure.literal(null);

		type _CheckNumberValue = ExpectType<
			DDataStructure.StructureValue<typeof numberStructure>,
			12,
			"strict"
		>;
		type _CheckBigintValue = ExpectType<
			DDataStructure.StructureValue<typeof bigintStructure>,
			12n,
			"strict"
		>;
		type _CheckBooleanValue = ExpectType<
			DDataStructure.StructureValue<typeof booleanStructure>,
			true,
			"strict"
		>;
		type _CheckUndefinedValue = ExpectType<
			DDataStructure.StructureValue<typeof undefinedStructure>,
			undefined,
			"strict"
		>;
		type _CheckNullValue = ExpectType<
			DDataStructure.StructureValue<typeof nullStructure>,
			null,
			"strict"
		>;

		expect(numberStructure.check(12)).toStrictEqual(
			DEither.right("check-success", 12),
		);
		expect(bigintStructure.check(12n)).toStrictEqual(
			DEither.right("check-success", 12n),
		);
		expect(booleanStructure.check(true)).toStrictEqual(
			DEither.right("check-success", true),
		);
		expect(undefinedStructure.check(undefined)).toStrictEqual(
			DEither.right("check-success", undefined),
		);
		expect(nullStructure.check(null)).toStrictEqual(
			DEither.right("check-success", null),
		);
		expect(booleanStructure.check(false)).not.toStrictEqual(
			DEither.right("check-success", false),
		);
	});

	it("creates a union structure from literal values", () => {
		const structure = DDataStructure.literal(["draft", "published", true]);

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.UnionStructure<"draft" | "published" | true, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			"draft" | "published" | true,
			"strict"
		>;

		expect(structure.definition.values).toHaveLength(3);
		expect(structure.check("draft")).toStrictEqual(
			DEither.right("check-success", "draft"),
		);
		expect(structure.check(true)).toStrictEqual(
			DEither.right("check-success", true),
		);
		expect(structure.is("archived")).toBe(false);
	});

	it("can model literal values inside object and array helpers", () => {
		const structure = DDataStructure.object({
			kind: DDataStructure.literal("user"),
			statuses: DDataStructure.array(DDataStructure.literal(["active", "disabled"])),
			metadata: DDataStructure.object({
				version: DDataStructure.literal(1),
				verified: DDataStructure.literal(true),
			}),
		});
		const input = {
			kind: "user",
			statuses: ["active", "disabled"],
			metadata: {
				version: 1,
				verified: true,
			},
		} as const;
		const invalidInput = {
			kind: "user",
			statuses: ["active", "archived"],
			metadata: {
				version: 1,
				verified: true,
			},
		} as const;

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly kind: "user";
				readonly statuses: readonly ("active" | "disabled")[];
				readonly metadata: {
					readonly version: 1;
					readonly verified: true;
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
			).issues,
		).toMatchObject([
			{
				data: "archived",
				path: "statuses.[array: 1].(union: 0)",
			},
			{
				data: "archived",
				path: "statuses.[array: 1].(union: 1)",
			},
		]);
	});
});
