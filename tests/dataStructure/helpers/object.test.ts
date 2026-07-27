import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("object", () => {
	it("creates an object structure from helper shapes", () => {
		const structure = DDataStructure.object({
			name: DDataStructure.string(),
			age: DDataStructure.number(),
		});
		const input = {
			name: "Jane",
			age: 30,
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
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
		const structure = DDataStructure.object({
			user: DDataStructure.object({
				profile: DDataStructure.object({
					name: DDataStructure.string(),
					contact: DDataStructure.object({
						email: DDataStructure.string([DDataStructure.email()]),
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
			DDataStructure.ObjectStructure<{
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
			DDataStructure.StructureValue<typeof structure>,
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
