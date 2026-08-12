import { DArray, type ExpectType } from "@scripts";

describe("infer", () => {
	it("inference without constraint", () => {
		const result: readonly ("a" | "b")[] = DArray.infer(["a", "b"]);

		expect(result).toStrictEqual(["a", "b"]);
	});

	it("correct infer generic constraint", () => {
		function testInference<
			RR extends { wrap: readonly ("a" | "b")[] & DArray.MinElements<2> },
		>(
			arg: RR,
		): RR["wrap"] {
			return arg.wrap;
		}
		const result = testInference({ wrap: DArray.infer(["a", "b"]) });

		type _CheckResult = ExpectType<
			typeof result,
			readonly ["a", "b"] & DArray.MinElements<2>,
			"strict"
		>;
	});

	it("correct infer generic constraint on tuple", () => {
		function testInference<
			RR extends { wrap: readonly ["a" | "A", "b" | "B"] & DArray.MinElements<2> },
		>(
			arg: RR,
		): RR["wrap"] {
			return arg.wrap;
		}
		const result = testInference({ wrap: DArray.infer(["a", "B"]) });

		type _CheckResult = ExpectType<
			typeof result,
			& readonly ["a", "B"]
			& DArray.LengthEqual<2>
			& DArray.MaxElements<2>
			& DArray.MinElements<2>,
			"strict"
		>;
	});

	it("correct infer LengthEqual constraint from tuple", () => {
		const result: readonly string[] & DArray.LengthEqual<3> = DArray.infer(
			["a", "b", "c"],
		);
	});

	it("correct infer MinElements constraint from tuple", () => {
		const result: readonly string[] & DArray.MinElements<2> = DArray.infer(
			["a", "b", "c"],
		);
	});

	it("correct infer MaxElements constraint from tuple", () => {
		const result: readonly string[] & DArray.MaxElements<5> = DArray.infer(
			["a", "b", "c"],
		);
	});

	it("correct infer all compatible constraints from tuple", () => {
		const result:
			& readonly string[]
			& DArray.LengthEqual<3>
			& DArray.MinElements<2>
			& DArray.MaxElements<5> = DArray.infer(
				["a", "b", "c"],
			);
	});

	it("correct infer all exact constraints from tuple", () => {
		const result:
			& readonly string[]
			& DArray.LengthEqual<3>
			& DArray.MinElements<3>
			& DArray.MaxElements<3> = DArray.infer(
				["a", "b", "c"],
			);
	});

	it("correct infer generic tuple through function argument", () => {
		function testInference<
			const GenericInput extends readonly string[],
			RR extends {
				wrap:
					& GenericInput
					& DArray.MinElements<2>
					& DArray.MaxElements<5>;
			},
		>(
			input: GenericInput,
			arg: RR,
		): RR["wrap"] {
			expect(arg.wrap).toStrictEqual(input);
			return arg.wrap;
		}
		const result = testInference(
			["a", "b", "c"],
			{ wrap: DArray.infer(["a", "b", "c"]) },
		);

		type _CheckResult = ExpectType<
			typeof result,
			readonly ["a", "b", "c"]
			& DArray.LengthEqual<3>
			& DArray.MaxElements<3>
			& DArray.MinElements<2>
			& DArray.MinElements<3>
			& DArray.MaxElements<5>,
			"strict"
		>;
	});

	it("correct infer compatible branch from output union", () => {
		function testInference<
			RR extends {
				wrap:
					| (readonly string[] & DArray.MinElements<2>)
					| (readonly string[] & DArray.MaxElements<2>);
			},
		>(
			arg: RR,
		): RR["wrap"] {
			return arg.wrap;
		}
		const result = testInference({ wrap: DArray.infer(["a", "b", "c"]) });

		type _CheckResult = ExpectType<
			typeof result,
			& readonly ["a", "b", "c"]
			& DArray.MinElements<2>,
			"strict"
		>;
	});

	it("correct infer compatible tuple branch from output union", () => {
		function testInference<
			RR extends {
				wrap:
					| (readonly ["a", "b", "c"] & DArray.MinElements<2>)
					| (readonly ["a", "b"] & DArray.MaxElements<2>);
			},
		>(
			arg: RR,
		): RR["wrap"] {
			return arg.wrap;
		}
		const result = testInference({ wrap: DArray.infer(["a", "b", "c"]) });

		type _CheckResult = ExpectType<
			typeof result,
			& readonly ["a", "b", "c"]
			& DArray.LengthEqual<3>
			& DArray.MaxElements<3>
			& DArray.MinElements<2>
			& DArray.MinElements<3>,
			"strict"
		>;
	});

	it("should reject incompatible MaxElements constraints", () => {
		const result: readonly string[] & DArray.MaxElements<2> = DArray.infer(
		// @ts-expect-error MaxElements<3> from the value does not induce MaxElements<2>.
			["a", "b", "c"],
		);
	});

	it("should reject incompatible MinElements constraints", () => {
		const result: readonly string[] & DArray.MinElements<4> = DArray.infer(
		// @ts-expect-error MinElements<3> from the value does not induce MinElements<4>.
			["a", "b", "c"],
		);
	});

	it("should reject incompatible LengthEqual constraints", () => {
		const result: readonly string[] & DArray.LengthEqual<2> = DArray.infer(
		// @ts-expect-error LengthEqual<3> from the value does not induce LengthEqual<2>.
			["a", "b", "c"],
		);
	});

	it("should reject LengthEqual declaration from input LengthEqual constraint", () => {
		const source = ["a", "b", "c"] as unknown as
			readonly string[] & DArray.LengthEqual<3>;
		DArray.infer(
		// @ts-expect-error infer only derives constraints from tuples, not from constrained arrays.
			source,
		);
	});

	it("should reject MinElements declaration from input LengthEqual constraint", () => {
		const source = ["a", "b", "c"] as unknown as
			readonly string[] & DArray.LengthEqual<3>;
		DArray.infer(
		// @ts-expect-error infer only derives constraints from tuples, not from constrained arrays.
			source,
		);
	});

	it("should reject MaxElements declaration from input LengthEqual constraint", () => {
		const source = ["a", "b", "c"] as unknown as
			readonly string[] & DArray.LengthEqual<3>;
		DArray.infer(
		// @ts-expect-error infer only derives constraints from tuples, not from constrained arrays.
			source,
		);
	});

	it("should reject MaxElements declaration from input MaxElements constraint", () => {
		const source = ["a", "b", "c"] as unknown as
			readonly string[] & DArray.MaxElements<5>;
		DArray.infer(
		// @ts-expect-error infer only derives constraints from tuples, not from constrained arrays.
			source,
		);
	});

	it("should reject MinElements declaration from input MinElements constraint", () => {
		const source = ["a", "b", "c"] as unknown as
			readonly string[] & DArray.MinElements<2>;
		DArray.infer(
		// @ts-expect-error infer only derives constraints from tuples, not from constrained arrays.
			source,
		);
	});

	it("should reject output union without compatible branch", () => {
		function testInference<
			RR extends {
				wrap:
					| (readonly string[] & DArray.MinElements<4>)
					| (readonly string[] & DArray.MaxElements<2>);
			},
		>(
			arg: RR,
		): RR["wrap"] {
			return arg.wrap;
		}

		testInference({
			wrap: DArray.infer(
				// @ts-expect-error no output union branch is induced by the tuple.
				["a", "b", "c"],
			),
		});
	});
});
