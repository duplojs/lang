import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("record", () => {
	it("creates a record structure from string key and value structures", () => {
		const structure = DDataStructure.record(
			DDataStructure.string(),
			DDataStructure.number(),
		);
		const input = {
			first: 1,
			second: 2,
		};
		const failure = structure.check({
			first: 1,
			second: "invalid",
		});

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.RecordStructure<
				Partial<{ readonly [Prop in string]: number }>,
				readonly []
			>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			Partial<{ readonly [Prop in string]: number }>,
			"strict"
		>;

		expect(structure.definition.requiredKeys).toBeNull();
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: "invalid",
			path: "{record value: second}",
		});
	});

	it("creates a record structure from literal key unions", () => {
		const structure = DDataStructure.record(
			DDataStructure.literal(["name", "role"]),
			DDataStructure.string(),
		);
		const input = {
			name: "Jane",
			role: "admin",
		};

		type _CheckStructure = ExpectType<
			typeof structure,
			DDataStructure.RecordStructure<
				{
					readonly name: string;
					readonly role: string;
				},
				readonly []
			>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly name: string;
				readonly role: string;
			},
			"strict"
		>;

		expect(structure.definition.requiredKeys).toStrictEqual(["name", "role"]);
		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(structure.is({
			name: "Jane",
			role: 123,
		})).toBe(false);
	});

	it("can be used inside nested object and array helpers", () => {
		const structure = DDataStructure.object({
			users: DDataStructure.array(
				DDataStructure.record(
					DDataStructure.literal(["name", "email"]),
					DDataStructure.string(),
				),
			),
		});
		const input = {
			users: [
				{
					name: "Jane",
					email: "jane@example.com",
				},
			],
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly users: readonly {
					readonly name: string;
					readonly email: string;
				}[];
			},
			"strict"
		>;

		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.check({
					users: [
						{
							name: "Jane",
						},
					],
				}),
				"check-error",
			).issues[0],
		).toMatchObject({
			data: undefined,
			path: "users.[array: 0].{record value: email}",
		});
	});
});
