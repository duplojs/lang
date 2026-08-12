import { DString, type ExpectType } from "@scripts";

describe("infer", () => {
	it("inference without constraint", () => {
		const result: "hello" = DString.infer("hello");

		expect(result).toBe("hello");
	});

	it("correct infer generic constraint", () => {
		function testInference<
			RR extends { wrap: string & DString.MinCharacters<5> },
		>(
			arg: RR,
		): RR["wrap"] {
			return arg.wrap;
		}
		const result = testInference({ wrap: DString.infer("hello") });

		type _CheckResult = ExpectType<
			typeof result,
			& "hello"
			& DString.MinCharacters<5>,
			"strict"
		>;
	});

	it("correct infer generic constraint on literal", () => {
		function testInference<
			RR extends { wrap: ("hello" | "world") & DString.MinCharacters<5> },
		>(
			arg: RR,
		): RR["wrap"] {
			return arg.wrap;
		}
		const result = testInference({ wrap: DString.infer("hello") });

		type _CheckResult = ExpectType<
			typeof result,
			& "hello"
			& DString.LengthEqual<5>
			& DString.MaxCharacters<5>
			& DString.MinCharacters<5>,
			"strict"
		>;
	});

	it("correct infer LengthEqual constraint from literal", () => {
		const result: string & DString.LengthEqual<5> = DString.infer("hello");
	});

	it("correct infer MinCharacters constraint from literal", () => {
		const result: string & DString.MinCharacters<3> = DString.infer("hello");
	});

	it("correct infer MaxCharacters constraint from literal", () => {
		const result: string & DString.MaxCharacters<8> = DString.infer("hello");
	});

	it("correct infer all compatible constraints from literal", () => {
		const result:
			& string
			& DString.LengthEqual<5>
			& DString.MinCharacters<3>
			& DString.MaxCharacters<8> = DString.infer("hello");
	});

	it("correct infer all exact constraints from literal", () => {
		const result:
			& string
			& DString.LengthEqual<5>
			& DString.MinCharacters<5>
			& DString.MaxCharacters<5> = DString.infer("hello");
	});

	it("correct infer generic literal through function argument", () => {
		function testInference<
			const GenericInput extends string,
			RR extends {
				wrap:
					& GenericInput
					& DString.MinCharacters<3>
					& DString.MaxCharacters<8>;
			},
		>(
			input: GenericInput,
			arg: RR,
		): RR["wrap"] {
			expect(arg.wrap).toBe(input);
			return arg.wrap;
		}
		const result = testInference(
			"hello",
			{ wrap: DString.infer("hello") },
		);

		type _CheckResult = ExpectType<
			typeof result,
			"hello"
			& DString.LengthEqual<5>
			& DString.MaxCharacters<5>
			& DString.MinCharacters<3>
			& DString.MinCharacters<5>
			& DString.MaxCharacters<8>,
			"strict"
		>;
	});

	it("correct infer compatible branch from output union", () => {
		function testInference<
			RR extends {
				wrap:
					| (string & DString.MinCharacters<3>)
					| (string & DString.MaxCharacters<3>);
			},
		>(
			arg: RR,
		): RR["wrap"] {
			return arg.wrap;
		}
		const result = testInference({ wrap: DString.infer("hello") });

		type _CheckResult = ExpectType<
			typeof result,
			& "hello"
			& DString.MinCharacters<3>,
			"strict"
		>;
	});

	it("correct infer compatible literal branch from output union", () => {
		function testInference<
			RR extends {
				wrap:
					| ("hello" & DString.MinCharacters<5>)
					| ("world" & DString.MaxCharacters<3>);
			},
		>(
			arg: RR,
		): RR["wrap"] {
			return arg.wrap;
		}
		const result = testInference({ wrap: DString.infer("hello") });

		type _CheckResult = ExpectType<
			typeof result,
			& "hello"
			& DString.LengthEqual<5>
			& DString.MaxCharacters<5>
			& DString.MinCharacters<5>,
			"strict"
		>;
	});

	it("should reject incompatible MaxCharacters constraints", () => {
		const result: string & DString.MaxCharacters<3> = DString.infer(
		// @ts-expect-error MaxCharacters<5> from the value does not induce MaxCharacters<3>.
			"hello",
		);
	});

	it("should reject incompatible MinCharacters constraints", () => {
		const result: string & DString.MinCharacters<8> = DString.infer(
		// @ts-expect-error MinCharacters<5> from the value does not induce MinCharacters<8>.
			"hello",
		);
	});

	it("should reject incompatible LengthEqual constraints", () => {
		const result: string & DString.LengthEqual<3> = DString.infer(
		// @ts-expect-error LengthEqual<5> from the value does not induce LengthEqual<3>.
			"hello",
		);
	});

	it("should reject non literal input", () => {
		const source = "hello" as string;

		DString.infer(
		// @ts-expect-error infer requires a literal string input.
			source,
		);
	});

	it("should reject constrained string input", () => {
		const source = "hello" as unknown as string & DString.LengthEqual<5>;

		DString.infer(
		// @ts-expect-error infer only derives constraints from literal strings.
			source,
		);
	});

	it("should reject output union without compatible branch", () => {
		function testInference<
			RR extends {
				wrap:
					| (string & DString.MinCharacters<8>)
					| (string & DString.MaxCharacters<3>);
			},
		>(
			arg: RR,
		): RR["wrap"] {
			return arg.wrap;
		}

		testInference({
			wrap: DString.infer(
				// @ts-expect-error no output union branch is induced by the literal.
				"hello",
			),
		});
	});
});
