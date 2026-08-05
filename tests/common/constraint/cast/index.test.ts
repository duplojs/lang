import { cast, type UnbundlesConstraint, type DString, type Constraint, type DModeling, type DNumber, type CastError, type RemoveConstraint } from "@scripts";

describe("cast", () => {
	it("", () => {
		type tt = UnbundlesConstraint<
			& DString.MaxCharacters<10>
			& DString.MaxCharacters<11>
			& DString.MaxCharacters<12>
		>;

		type kk = UnbundlesConstraint<
			DString.MaxCharacters<10>
			& DString.MaxCharacters<12>
			& DString.AllowedCharacters<"0-9" | "A-Z">
		>;

		type oo = UnbundlesConstraint<
			DString.MaxCharacters<12> & DString.AllowedCharacters<"0-9" | "A-Z">
		>;

		type hh = UnbundlesConstraint<
			DString.MaxCharacters<12> & Constraint<"0-9", Record<1 | 2, Record<3 | 4, unknown>>>
		>;

		type bb = UnbundlesConstraint<
			Constraint<"0-9" | "e", unknown> & Constraint<"0", unknown>
		>;

		type jj = UnbundlesConstraint<
			DString.AllowedCharacters<"0-9" | "A-Z">
		>;

		type vv = UnbundlesConstraint<
			DString.AllowedCharacters<"0-9" | "A-Z">
			& DString.MaxCharacters<12 | 13>
			& DString.MinCharacters<12 | 13>
			& DString.MaxCharacters<10>
		>;

		type uu = UnbundlesConstraint<
			& string
			& DString.AllowedCharacters<"0-9">
			& DString.AllowedCharacters<"A-Z">
			& DModeling.NewType<"test", DString.MaxCharacters<20>>
			& DString.MaxCharacters<10>
		>;

		type yy = RemoveConstraint<
			& string
			& DString.AllowedCharacters<"0-9">
			& DString.AllowedCharacters<"A-z">
			& DModeling.NewType<"test", DString.MaxCharacters<20>>
			& DString.MaxCharacters<10>
		>;

		const value1: (
			// | (string & DString.Email)
			| (string & DString.MaxCharacters<10> & DString.MinCharacters<5>)
			| (number & DNumber.LessThan<12>)
			// | (string & DString.MinCharacters<10>)
		) = cast("test" as (string & DString.MaxCharacters<5>) | (number & DNumber.LessThan<12>));

		const value2: string & DString.MinCharacters<10> = cast("test");
	});

	it("cast greaterThan", () => {
		const value1: number & DNumber.GreaterThan<12> = cast(1 as number & DNumber.GreaterThan<12>);

		const value2: number & DNumber.GreaterThan<12> = cast(1 as number & DNumber.GreaterThan<15>);

		const value3: number & DNumber.GreaterThan<12> = cast(
			1 as number & DNumber.GreaterThan<6> & CastError<
				"Impossible to cast on GreaterThan<12> because constraint GreaterThan<6> from the value is less than.",
				number & DNumber.GreaterThan<6>,
				DNumber.GreaterThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value35: number & DNumber.GreaterThan<12> = cast(1 as number);

		const value4: number & DNumber.GreaterThan<12> = cast(1 as number & DNumber.GreaterThanOrEqual<15>);

		const value5: number & DNumber.GreaterThan<12> = cast(
			1 as number & DNumber.GreaterThanOrEqual<12> & CastError<
				"Impossible to cast on GreaterThan<12> because constraint GreaterThanOrEqual<12> from the value is less than or equal.",
				number & DNumber.GreaterThanOrEqual<12>,
				DNumber.GreaterThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value55: number & DNumber.GreaterThan<12> = cast(1 as number & DNumber.GreaterThanOrEqual<12>);

		const value6: number & DNumber.GreaterThan<12> = cast(
			1 as number & DNumber.GreaterThanOrEqual<6> & CastError<
				"Impossible to cast on GreaterThan<12> because constraint GreaterThanOrEqual<6> from the value is less than or equal.",
				number & DNumber.GreaterThanOrEqual<6>,
				DNumber.GreaterThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value65: number & DNumber.GreaterThan<12> = cast(1 as number & DNumber.GreaterThanOrEqual<6>);

		const value7: number & DNumber.GreaterThan<12> = cast(
			1 as number & CastError<
				"Impossible to cast on GreaterThan<12> because value does not have compatible constraint.",
				number,
				DNumber.GreaterThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value75: number & DNumber.GreaterThan<12> = cast(1 as number);
	});

	it("cast greaterThanOrEqual", () => {
		const value1: number & DNumber.GreaterThanOrEqual<12> = cast(1 as number & DNumber.GreaterThanOrEqual<12>);

		const value2: number & DNumber.GreaterThanOrEqual<12> = cast(1 as number & DNumber.GreaterThanOrEqual<15>);

		const value3: number & DNumber.GreaterThanOrEqual<12> = cast(
			1 as number & DNumber.GreaterThanOrEqual<6> & CastError<
				"Impossible to cast on GreaterThanOrEqual<12> because constraint GreaterThanOrEqual<6> from the value is less than.",
				number & DNumber.GreaterThanOrEqual<6>,
				DNumber.GreaterThanOrEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value35: number & DNumber.GreaterThanOrEqual<12> = cast(1 as number & DNumber.GreaterThanOrEqual<6>);

		const value4: number & DNumber.GreaterThanOrEqual<12> = cast(1 as number & DNumber.GreaterThan<15>);

		const value5: number & DNumber.GreaterThanOrEqual<12> = cast(
			1 as number & DNumber.GreaterThan<12> & CastError<
				"Impossible to cast on GreaterThanOrEqual<12> because constraint GreaterThan<12> from the value is less than or equal.",
				number & DNumber.GreaterThan<12>,
				DNumber.GreaterThanOrEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value55: number & DNumber.GreaterThanOrEqual<12> = cast(1 as number & DNumber.GreaterThan<12>);

		const value6: number & DNumber.GreaterThanOrEqual<12> = cast(
			1 as number & DNumber.GreaterThan<6> & CastError<
				"Impossible to cast on GreaterThanOrEqual<12> because constraint GreaterThan<6> from the value is less than or equal.",
				number & DNumber.GreaterThan<6>,
				DNumber.GreaterThanOrEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value65: number & DNumber.GreaterThanOrEqual<12> = cast(1 as number & DNumber.GreaterThan<6>);

		const value7: number & DNumber.GreaterThanOrEqual<12> = cast(
			1 as number & CastError<
				"Impossible to cast on GreaterThanOrEqual<12> because value does not have compatible constraint.",
				number,
				DNumber.GreaterThanOrEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value75: number & DNumber.GreaterThanOrEqual<12> = cast(1 as number);
	});

	it("cast lessThan", () => {
		const value1: number & DNumber.LessThan<12> = cast(1 as number & DNumber.LessThan<12>);

		const value2: number & DNumber.LessThan<12> = cast(1 as number & DNumber.LessThan<6>);

		const value3: number & DNumber.LessThan<12> = cast(
			1 as number & DNumber.LessThan<15> & CastError<
				"Impossible to cast on LessThan<12> because constraint LessThan<15> from the value is greater than.",
				number & DNumber.LessThan<15>,
				DNumber.LessThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value35: number & DNumber.LessThan<12> = cast(1 as number & DNumber.LessThan<15>);

		const value4: number & DNumber.LessThan<12> = cast(1 as number & DNumber.LessThanOrEqual<6>);

		const value5: number & DNumber.LessThan<12> = cast(
			1 as number & DNumber.LessThanOrEqual<12> & CastError<
				"Impossible to cast on LessThan<12> because constraint LessThanOrEqual<12> from the value is greater than or equal.",
				number & DNumber.LessThanOrEqual<12>,
				DNumber.LessThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value55: number & DNumber.LessThan<12> = cast(1 as number & DNumber.LessThanOrEqual<12>);

		const value6: number & DNumber.LessThan<12> = cast(
			1 as number & DNumber.LessThanOrEqual<15> & CastError<
				"Impossible to cast on LessThan<12> because constraint LessThanOrEqual<15> from the value is greater than or equal.",
				number & DNumber.LessThanOrEqual<15>,
				DNumber.LessThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value65: number & DNumber.LessThan<12> = cast(1 as number & DNumber.LessThanOrEqual<15>);

		const value7: number & DNumber.LessThan<12> = cast(
			1 as number & CastError<
				"Impossible to cast on LessThan<12> because value does not have compatible constraint.",
				number,
				DNumber.LessThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value75: number & DNumber.LessThan<12> = cast(1 as number);
	});

	it("cast lessThanOrEqual", () => {
		const value1: number & DNumber.LessThanOrEqual<12> = cast(1 as number & DNumber.LessThanOrEqual<12>);

		const value2: number & DNumber.LessThanOrEqual<12> = cast(1 as number & DNumber.LessThanOrEqual<6>);

		const value3: number & DNumber.LessThanOrEqual<12> = cast(
			1 as number & DNumber.LessThanOrEqual<15> & CastError<
				"Impossible to cast on LessThanOrEqual<12> because constraint LessThanOrEqual<15> from the value is greater than.",
				number & DNumber.LessThanOrEqual<15>,
				DNumber.LessThanOrEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value35: number & DNumber.LessThanOrEqual<12> = cast(1 as number & DNumber.LessThanOrEqual<15>);

		const value4: number & DNumber.LessThanOrEqual<12> = cast(1 as number & DNumber.LessThan<12>);

		const value5: number & DNumber.LessThanOrEqual<12> = cast(
			1 as number & DNumber.LessThan<15> & CastError<
				"Impossible to cast on LessThanOrEqual<12> because constraint LessThan<15> from the value is greater than.",
				number & DNumber.LessThan<15>,
				DNumber.LessThanOrEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value55: number & DNumber.LessThanOrEqual<12> = cast(1 as number & DNumber.LessThan<15>);

		const value6: number & DNumber.LessThanOrEqual<12> = cast(
			1 as number & CastError<
				"Impossible to cast on LessThanOrEqual<12> because value does not have compatible constraint.",
				number,
				DNumber.LessThanOrEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value65: number & DNumber.LessThanOrEqual<12> = cast(1 as number);
	});
});
