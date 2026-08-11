import { DDataStructure, DModeling, pipe, type ExpectType } from "@scripts";

describe("createFlag", () => {
	const name = DModeling.createNewEntity("UserName", DDataStructure.string());
	const userStructure = DModeling.createEntity("User", () => ({ name }));
	const userName = "Jane" as DDataStructure.StructureValue<typeof name>;

	it("creates a flag handler for an entity and value structure", () => {
		const valueStructure = DDataStructure.string();
		const flag = DModeling.createFlag(userStructure, "UserRole", valueStructure);

		expect(flag.name).toBe("UserRole");
		expect(flag.entityStructure).toBe(userStructure);
		expect(flag.valueStructure).toBe(valueStructure);
	});

	it("appends and reads a flag without mutating the entity", () => {
		const flag = DModeling.createFlag(userStructure, "UserRole", DDataStructure.string());
		const entity = userStructure.new({ name: userName });
		const result = flag.append(entity, "admin");

		expect(result).not.toBe(entity);
		expect(flag.has(entity)).toBe(false);
		expect(flag.has(result)).toBe(true);
		expect(flag.getValue(result)).toBe("admin");
	});

	it("appends a flag in a pipe", () => {
		const flag = DModeling.createFlag(userStructure, "UserRole", DDataStructure.string());
		const entity = userStructure.new({ name: userName });
		const result = pipe(entity, flag.append("reader"));

		expect(flag.getValue(result)).toBe("reader");
	});

	it("preserves other flags when appending a new one", () => {
		const role = DModeling.createFlag(userStructure, "UserRole", DDataStructure.string());
		const state = DModeling.createFlag(userStructure, "UserState");
		const entity = userStructure.new({ name: userName });
		const result = state.append(role.append(entity, "admin"), null);

		expect(role.getValue(result)).toBe("admin");
		expect(state.getValue(result)).toBe(null);
	});

	it("narrows an entity union to the flagged branch", () => {
		const flag = DModeling.createFlag(userStructure, "UserRole", DDataStructure.string());
		const entity = userStructure.new({ name: userName });
		const input: typeof entity | ReturnType<typeof flag.append<typeof entity, "admin">> = entity;

		if (flag.has(input)) {
			type _CheckNarrowed = ExpectType<
				typeof input,
				Extract<typeof input, DModeling.Flag<"UserRole", "admin">>,
				"strict"
			>;
		}
	});
});
