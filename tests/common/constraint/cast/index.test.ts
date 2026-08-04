import { cast, type UnbundlesConstraint, type DString, type Constraint, type DModeling, NeverCoalescing } from "@scripts";

describe("cast", () => {
	it("", () => {
		type tt = UnbundlesConstraint<
			DString.MaxCharacters<10> & DString.MaxCharacters<11> & DString.MaxCharacters<12>
		>;

		type kk = UnbundlesConstraint<
			DString.MaxCharacters<10>
			& DString.MaxCharacters<12>
			& DString.ContainsOnly<"0-9" | "A-Z">
		>;

		type oo = UnbundlesConstraint<
			DString.MaxCharacters<12> & DString.ContainsOnly<"0-9" | "A-Z">
		>;

		type hh = UnbundlesConstraint<
			DString.MaxCharacters<12> & Constraint<"0-9", Record<1 | 2, Record<3 | 4, unknown>>>
		>;

		type bb = UnbundlesConstraint<
			Constraint<"0-9" | "e", unknown> & Constraint<"0", unknown>
		>;

		type jj = UnbundlesConstraint<
			DString.ContainsOnly<"0-9" | "A-Z">
		>;

		type vv = UnbundlesConstraint<
			DString.ContainsOnly<"0-9" | "A-Z">
			& DString.MaxCharacters<12 | 13>
			& DString.MinCharacters<12 | 13>
			& DString.MaxCharacters<10>
		>;

		type uu = UnbundlesConstraint<
			DString.ContainsOnly<"0-9" | "A-Z">
			& DModeling.NewType<"test", DString.MaxCharacters<20>>
			& DString.MaxCharacters<10>
		>;

		const value1: string & DString.MaxCharacters<10> = cast("test");

		const value2: string & DString.MinCharacters<10> = cast("test");
	});
});
