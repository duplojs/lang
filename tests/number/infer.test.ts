import { DNumber, type ExpectType } from "@scripts";

describe("infer", () => {
	it("inference without constraint", () => {
		const result: 3 = DNumber.infer(3);

		expect(result).toBe(3);
	});

	it("correct infer generic constraint", () => {
		function testInference<
			RR extends { wrap: number & DNumber.GreaterThan<2> },
		>(
			arg: RR,
		): RR["wrap"] {
			return arg.wrap;
		}
		const result = testInference({ wrap: DNumber.infer(3) });

		type _CheckResult = ExpectType<
			typeof result,
			& 3
			& DNumber.GreaterThan<2>,
			"strict"
		>;
	});

	it("correct infer generic constraint on literal", () => {
		function testInference<
			RR extends { wrap: (3 | 4) & DNumber.GreaterThan<2> },
		>(
			arg: RR,
		): RR["wrap"] {
			return arg.wrap;
		}
		const result = testInference({ wrap: DNumber.infer(3) });

		type _CheckResult = ExpectType<
			typeof result,
			& 3
			& DNumber.GreaterThan<2>
			& DNumber.GreaterThanOrEqual<3>
			& DNumber.LessThanOrEqual<3>,
			"strict"
		>;
	});

	it("correct infer GreaterThan constraint from literal", () => {
		const result: number & DNumber.GreaterThan<2> = DNumber.infer(3);
	});

	it("correct infer GreaterThanOrEqual constraint from literal", () => {
		const result: number & DNumber.GreaterThanOrEqual<3> = DNumber.infer(3);
	});

	it("correct infer LessThan constraint from literal", () => {
		const result: number & DNumber.LessThan<4> = DNumber.infer(3);
	});

	it("correct infer LessThanOrEqual constraint from literal", () => {
		const result: number & DNumber.LessThanOrEqual<3> = DNumber.infer(3);
	});

	it("correct infer Positive constraint from literal", () => {
		const result: number & DNumber.Positive = DNumber.infer(0);
	});

	it("correct infer Negative constraint from literal", () => {
		const result: number & DNumber.Negative = DNumber.infer(0);
	});

	it("correct infer StrictPositive constraint from literal", () => {
		const result: number & DNumber.StrictPositive = DNumber.infer(1);
	});

	it("correct infer StrictNegative constraint from literal", () => {
		const result: number & DNumber.StrictNegative = DNumber.infer(-1);
	});

	it("correct infer Integer constraint from literal", () => {
		const result: number & DNumber.Integer = DNumber.infer(3);
	});

	it("correct infer Int constraint from literal", () => {
		const result: number & DNumber.Int = DNumber.infer(3);
	});

	it("correct infer NotZero constraint from literal", () => {
		const result: number & DNumber.NotZero = DNumber.infer(-1);
	});

	it("correct infer Safe constraint from literal", () => {
		const result: number & DNumber.Safe = DNumber.infer(1.5);
	});

	it("correct infer all compatible constraints from literal", () => {
		const result:
			& number
			& DNumber.GreaterThan<2>
			& DNumber.GreaterThanOrEqual<3>
			& DNumber.LessThan<4>
			& DNumber.LessThanOrEqual<3>
			& DNumber.Integer
			& DNumber.NotZero
			& DNumber.Safe = DNumber.infer(3);
	});

	it("correct infer all exact constraints from literal", () => {
		const result:
			& number
			& DNumber.GreaterThanOrEqual<3>
			& DNumber.LessThanOrEqual<3>
			& DNumber.Integer
			& DNumber.NotZero
			& DNumber.Safe = DNumber.infer(3);
	});

	it("correct infer generic literal through function argument", () => {
		function testInference<
			const GenericInput extends number,
			RR extends {
				wrap:
					& GenericInput
					& DNumber.GreaterThan<2>
					& DNumber.LessThan<8>
					& DNumber.Integer
					& DNumber.NotZero
					& DNumber.Safe;
			},
		>(
			input: GenericInput,
			arg: RR,
		): RR["wrap"] {
			expect(arg.wrap).toBe(input);
			return arg.wrap;
		}
		const result = testInference(
			3,
			{ wrap: DNumber.infer(3) },
		);

		type _CheckResult = ExpectType<
			typeof result,
			& 3
			& DNumber.GreaterThan<2>
			& DNumber.GreaterThanOrEqual<3>
			& DNumber.LessThan<8>
			& DNumber.LessThanOrEqual<3>
			& DNumber.Integer
			& DNumber.NotZero
			& DNumber.Safe,
			"strict"
		>;
	});

	it("correct infer compatible branch from output union", () => {
		function testInference<
			RR extends {
				wrap:
					| (number & DNumber.GreaterThan<0>)
					| (number & DNumber.LessThan<0>);
			},
		>(
			arg: RR,
		): RR["wrap"] {
			return arg.wrap;
		}
		const result = testInference({ wrap: DNumber.infer(1) });

		type _CheckResult = ExpectType<
			typeof result,
			& 1
			& DNumber.GreaterThan<0>,
			"strict"
		>;
	});

	it("correct infer compatible literal branch from output union", () => {
		function testInference<
			RR extends {
				wrap:
					| (1 & DNumber.GreaterThan<0>)
					| (2 & DNumber.LessThan<3>);
			},
		>(
			arg: RR,
		): RR["wrap"] {
			return arg.wrap;
		}
		const result = testInference({ wrap: DNumber.infer(1) });

		type _CheckResult = ExpectType<
			typeof result,
			& 1
			& DNumber.GreaterThan<0>
			& DNumber.GreaterThanOrEqual<1>
			& DNumber.LessThanOrEqual<1>,
			"strict"
		>;
	});

	it("should reject incompatible GreaterThan constraints", () => {
		const result: number & DNumber.GreaterThan<3> = DNumber.infer(
		// @ts-expect-error GreaterThanOrEqual<3> from the value does not induce GreaterThan<3>.
			3,
		);
	});

	it("should reject incompatible GreaterThanOrEqual constraints", () => {
		const result: number & DNumber.GreaterThanOrEqual<4> = DNumber.infer(
		// @ts-expect-error GreaterThanOrEqual<3> from the value does not induce GreaterThanOrEqual<4>.
			3,
		);
	});

	it("should reject incompatible LessThan constraints", () => {
		const result: number & DNumber.LessThan<3> = DNumber.infer(
		// @ts-expect-error LessThanOrEqual<3> from the value does not induce LessThan<3>.
			3,
		);
	});

	it("should reject incompatible LessThanOrEqual constraints", () => {
		const result: number & DNumber.LessThanOrEqual<2> = DNumber.infer(
		// @ts-expect-error LessThanOrEqual<3> from the value does not induce LessThanOrEqual<2>.
			3,
		);
	});

	it("should reject incompatible Positive constraints", () => {
		const result: number & DNumber.Positive = DNumber.infer(
		// @ts-expect-error GreaterThanOrEqual<-1> from the value does not induce Positive.
			-1,
		);
	});

	it("should reject incompatible Negative constraints", () => {
		const result: number & DNumber.Negative = DNumber.infer(
		// @ts-expect-error LessThanOrEqual<1> from the value does not induce Negative.
			1,
		);
	});

	it("should reject incompatible StrictPositive constraints", () => {
		const result: number & DNumber.StrictPositive = DNumber.infer(
		// @ts-expect-error GreaterThanOrEqual<0> from the value does not induce StrictPositive.
			0,
		);
	});

	it("should reject incompatible StrictNegative constraints", () => {
		const result: number & DNumber.StrictNegative = DNumber.infer(
		// @ts-expect-error LessThanOrEqual<0> from the value does not induce StrictNegative.
			0,
		);
	});

	it("should reject incompatible Integer constraints", () => {
		const result: number & DNumber.Integer = DNumber.infer(
		// @ts-expect-error infer cannot derive Integer from a decimal literal.
			3.5,
		);
	});

	it("should reject incompatible NotZero constraints", () => {
		const result: number & DNumber.NotZero = DNumber.infer(
		// @ts-expect-error infer cannot derive NotZero from zero.
			0,
		);
	});

	it("should reject incompatible Safe max boundary", () => {
		const result: number & DNumber.Safe = DNumber.infer(
		// @ts-expect-error infer cannot derive Safe from the excluded max safe boundary.
			9007199254740992,
		);
	});

	it("should reject incompatible Safe min boundary", () => {
		const result: number & DNumber.Safe = DNumber.infer(
		// @ts-expect-error infer cannot derive Safe from the excluded min safe boundary.
			-9007199254740992,
		);
	});

	it("should reject non literal input", () => {
		const source = 3 as number;

		DNumber.infer(
		// @ts-expect-error infer requires a literal number input.
			source,
		);
	});

	it("should reject union input", () => {
		const source = 1 as 1 | 2;

		DNumber.infer(
		// @ts-expect-error infer requires one literal number, not a union.
			source,
		);
	});

	it("should reject constrained number input", () => {
		const source = 3 as unknown as number & DNumber.Integer;

		DNumber.infer(
		// @ts-expect-error infer only derives constraints from literal numbers.
			source,
		);
	});

	it("should reject output union without compatible branch", () => {
		function testInference<
			RR extends {
				wrap:
					| (number & DNumber.GreaterThan<2>)
					| (number & DNumber.LessThan<0>);
			},
		>(
			arg: RR,
		): RR["wrap"] {
			return arg.wrap;
		}

		testInference({
			wrap: DNumber.infer(
				// @ts-expect-error no output union branch is induced by the literal.
				1,
			),
		});
	});
});
