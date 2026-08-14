import { DKind, type DCommon, type ExpectType, pipe, when } from "@scripts";

describe("createKindIdentifier", () => {
	it("creates a predicate that checks one or several kind handlers", () => {
		const parentKind = DKind.create<"identifier-parent">("identifier-parent");
		const childKind = DKind.create<"identifier-child">("identifier-child");
		const identifier = DKind.createKindIdentifier<
			DKind.Kind<typeof parentKind>,
			& DKind.Kind<typeof parentKind>
			& DKind.Kind<typeof childKind>
		>();
		const child = parentKind.addTo(
			childKind.addTo({ name: "child" as const }, null),
			null,
		);
		const parentOnly = parentKind.addTo({ name: "parent" as const }, null);

		expect(identifier(child, childKind)).toBe(true);
		expect(identifier(parentOnly, childKind)).toBe(false);
		expect(identifier(child, [parentKind, childKind])).toBe(true);
		expect(identifier(parentOnly, [parentKind, childKind])).toBe(false);
	});

	it("narrows parent unions to compatible children", () => {
		const parentKind = DKind.create<"identifier-union-parent">("identifier-union-parent");
		const childKind = DKind.create<"identifier-union-child">("identifier-union-child");
		const siblingKind = DKind.create<"identifier-union-sibling">("identifier-union-sibling");

		type Child = DCommon.UnionToIntersection<
			& DKind.Kind<typeof parentKind>
			& DKind.Kind<typeof childKind>
			& { readonly name: "child" }
		>;
		type Sibling = DCommon.UnionToIntersection<
			& DKind.Kind<typeof parentKind>
			& DKind.Kind<typeof siblingKind>
			& { readonly name: "sibling" }
		>;

		const child = parentKind.addTo(
			childKind.addTo({ name: "child" as const }, null),
			null,
		) as Child;
		const input: Child | Sibling = child;
		const identifier = DKind.createKindIdentifier<
			DKind.Kind<typeof parentKind>,
			Child | Sibling
		>();

		if (identifier(input, childKind)) {
			type _CheckInput = ExpectType<
				typeof input,
				Child,
				"strict"
			>;

			expect(input.name).toBe("child");
		}
	});

	it("narrows with the curried signature in a pipe", () => {
		const parentKind = DKind.create<"identifier-pipe-parent">("identifier-pipe-parent");
		const childKind = DKind.create<"identifier-pipe-child">("identifier-pipe-child");

		type Child = DCommon.UnionToIntersection<
			& DKind.Kind<typeof parentKind>
			& DKind.Kind<typeof childKind>
			& { readonly name: "child" }
		>;

		const child = parentKind.addTo(
			childKind.addTo({ name: "child" as const }, null),
			null,
		) as Child;
		const input: Child | { readonly name: "plain" } = child;
		const identifier = DKind.createKindIdentifier<
			DKind.Kind<typeof parentKind>,
			Child
		>();

		const result = pipe(
			input,
			when(
				identifier(childKind),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						Child,
						"strict"
					>;

					return value.name;
				},
			),
		);

		expect(result).toBe("child");
	});
});
