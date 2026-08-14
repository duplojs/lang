import { DDataStructure, DEither } from "@scripts";

describe("RefineConstraint", () => {
	it("creates a synchronous refine constraint", () => {
		const refine = vi.fn((data: unknown) => data === "valid");
		const constraint = DDataStructure.RefineConstraint(refine);

		expect(constraint.definition).toEqual({ refine });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts values matching the refinement", () => {
		const constraint = DDataStructure.RefineConstraint(
			(data: string) => data.startsWith("user:"),
		);

		expect(constraint.executeCheck("user:123")).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects values that do not match the refinement without an error handler", () => {
		const constraint = DDataStructure.RefineConstraint(
			(data: string) => data.startsWith("user:"),
		);

		expect(constraint.executeCheck("admin:123")).toBe(DDataStructure.ErrorSymbol);
	});

	it("adds itself to the error handler when a value is rejected", () => {
		const constraint = DDataStructure.RefineConstraint(
			(data: string) => data.length >= 3,
		);
		const errorHandler = DDataStructure.createGetErrorHandler();

		expect(constraint.executeCheck("", errorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(errorHandler().createError().issues).toHaveLength(1);
		expect(errorHandler().createError().issues[0]?.getSource()).toBe(constraint);
	});

	it("delegates the checked value to the refinement function", () => {
		const refine = vi.fn((data: string) => data.includes("@"));
		const constraint = DDataStructure.RefineConstraint(refine);

		expect(constraint.executeCheck("contact@example.com")).toBe(
			DDataStructure.SuccessSymbol,
		);
		expect(refine).toHaveBeenCalledWith("contact@example.com");
	});

	it("can refine a number data structure", () => {
		const structure = DDataStructure.number([
			DDataStructure.RefineConstraint(
				(data) => data >= 18,
			),
		]);
		const success = structure.check(21);
		const failure = structure.check(17);

		expect(success).toStrictEqual(DEither.right("check-success", 21));
		expect(structure.is(21)).toBe(true);
		expect(structure.is(17)).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: 17,
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0]?.getSource(),
		).toBe(structure.definition.constraints[0]);
	});
});
