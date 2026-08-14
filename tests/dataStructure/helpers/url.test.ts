import { DDataStructure, DEither, type DString, type ExpectType } from "@scripts";

describe("url", () => {
	it("creates and applies a url constraint", () => {
		const params = { protocol: /^https$/ };
		const constraint = DDataStructure.url(params);
		const structure = DDataStructure.string([constraint]);
		const success = structure.check("https://example.com");
		const failure = structure.check("ftp://example.com");

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.UrlConstraint,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string & DString.Url,
			"strict"
		>;

		expect(constraint.definition).toEqual({ params });
		expect(constraint.executeCheck("https://example.com")).toBe(
			DDataStructure.SuccessSymbol,
		);
		expect(constraint.executeCheck("ftp://example.com")).toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(success).toStrictEqual(
			DEither.right("check-success", "https://example.com"),
		);
		expect(structure.is("ftp://example.com")).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(constraint);
	});
});
