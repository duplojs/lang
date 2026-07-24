import { describe, expect, it } from "vitest";
import { DS, DEither, type ExpectType } from "@scripts";

describe("object", () => {
	it("creates an object structure from helper shapes", () => {
		const structure = DS.object({
			name: DS.string(),
			age: DS.number(),
		});
		const input = {
			name: "Jane",
			age: 30,
		};

		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			{
				readonly name: string;
				readonly age: number;
			},
			"strict"
		>;

		expect(structure.definition.shape.value).toHaveLength(2);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
	});

	it("keeps nested object helper output coherent", () => {
		const structure = DS.object({
			user: DS.object({
				profile: DS.object({
					name: DS.string(),
					contact: DS.object({
						email: DS.string([DS.email()]),
					}),
				}),
			}),
		});
		const input = {
			user: {
				profile: {
					name: "Jane",
					contact: {
						email: "jane@example.com",
					},
				},
			},
		};

		type _CheckStructure = ExpectType<
			typeof structure,
			DS.ObjectStructure<{
				readonly user: {
					readonly profile: {
						readonly name: string;
						readonly contact: {
							readonly email: `${string}@${string}.${string}`;
						};
					};
				};
			}, readonly []>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DS.StructureValue<typeof structure>,
			{
				readonly user: {
					readonly profile: {
						readonly name: string;
						readonly contact: {
							readonly email: `${string}@${string}.${string}`;
						};
					};
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
