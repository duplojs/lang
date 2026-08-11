import { DDataStructure, DModeling, type ExpectType } from "@scripts";

describe("createEntityNamespace", () => {
	it("creates consistently prefixed modeling helpers", () => {
		const namespace = DModeling.createEntityNamespace("User");
		const name = namespace.createNewType("Name", DDataStructure.string());
		const entity = namespace.createEntity(() => ({ name }));
		const role = namespace.createFlag(entity, "Role", DDataStructure.string());

		type _CheckName = ExpectType<
			typeof name,
			DModeling.NewTypeStructure<"UserName", string, readonly []>,
			"strict"
		>;
		type _CheckEntity = ExpectType<
			typeof entity,
			DModeling.EntityStructure<
				"User",
				{ readonly name: string & DModeling.NewType<"UserName"> }
			>,
			"strict"
		>;
		type _CheckFlag = ExpectType<
			typeof role,
			DModeling.FlagHandler<
				& DModeling.Entity<"User">
				& { readonly name: string & DModeling.NewType<"UserName", never> },
				"UserRole",
				string
			>,
			"strict"
		>;

		expect(namespace.name).toBe("User");
		expect(name.name).toBe("UserName");
		expect(entity.name).toBe("User");
		expect(role.name).toBe("UserRole");
		expect(role.entityStructure).toBe(entity);
	});

	it("only creates flags for entities from the same namespace", () => {
		const users = DModeling.createEntityNamespace("User");
		const organizations = DModeling.createEntityNamespace("Organization");
		const organizationName = organizations.createNewType("Name", DDataStructure.string());
		const organization = organizations.createEntity(() => ({ name: organizationName }));

		// @ts-expect-error a User flag cannot target an Organization entity.
		users.createFlag(organization, "Role", DDataStructure.string());
	});
});
