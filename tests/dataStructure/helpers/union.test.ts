import { describe, expect, it } from "vitest";
import { DS, DEither, type ExpectType } from "@scripts";

describe("union", () => {
	it("creates a union structure from helper structures", () => {
		const structure = DS.union([
			DS.string(),
			DS.number(),
			DS.boolean(),
		]);
		const success = structure.check("value");
		const failure = structure.check(null);

		type _CheckStructure = ExpectType<
			typeof structure,
			DS.UnionStructure<string | number | boolean, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			string | number | boolean,
			"strict"
		>;

		expect(structure.definition.values).toHaveLength(3);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(success).toStrictEqual(DEither.right("check-success", "value"));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues,
		).toMatchObject([
			{
				data: null,
				path: "(union: 0)",
			},
			{
				data: null,
				path: "(union: 1)",
			},
			{
				data: null,
				path: "(union: 2)",
			},
		]);
	});

	it("can combine literal object and array helpers", () => {
		const structure = DS.union([
			DS.object({
				kind: DS.literal("user"),
				email: DS.string([DS.email()]),
				active: DS.boolean(),
			}),
			DS.object({
				kind: DS.literal("batch"),
				values: DS.array(DS.union([
					DS.number(),
					DS.literal("skip"),
				])),
			}),
		]);
		const userInput = {
			kind: "user",
			email: "jane@example.com",
			active: true,
		} as const;
		const batchInput = {
			kind: "batch",
			values: [1, "skip", 2],
		} as const;

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			| {
				readonly kind: "user";
				readonly email: `${string}@${string}.${string}`;
				readonly active: boolean;
			}
			| {
				readonly kind: "batch";
				readonly values: readonly (number | "skip")[];
			},
			"strict"
		>;

		expect(structure.check(userInput)).toStrictEqual(
			DEither.right("check-success", userInput),
		);
		expect(structure.check(batchInput)).toStrictEqual(
			DEither.right("check-success", batchInput),
		);
		expect(structure.is({
			kind: "batch",
			values: [1, "invalid"],
		})).toBe(false);
	});

	it("can be used inside nested object and array helpers", () => {
		const structure = DS.object({
			events: DS.array(DS.object({
				id: DS.union([
					DS.string(),
					DS.number(),
				]),
				payload: DS.union([
					DS.null(),
					DS.object({
						count: DS.number(),
						flags: DS.array(DS.boolean()),
					}),
				]),
			})),
		});
		const input = {
			events: [
				{
					id: "evt-1",
					payload: null,
				},
				{
					id: 2,
					payload: {
						count: 3,
						flags: [true, false],
					},
				},
			],
		};

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			{
				readonly events: readonly {
					readonly id: string | number;
					readonly payload:
						| null
						| {
							readonly count: number;
							readonly flags: readonly boolean[];
						};
				}[];
			},
			"strict"
		>;

		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(structure.is(input)).toBe(true);
	});
});
