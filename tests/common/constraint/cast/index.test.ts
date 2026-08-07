import { cast, type DArray, type DNumber, type CastError, type DString } from "@scripts";

describe("cast", () => {
	it("cast maxCharacters", () => {
		const value1: string & DString.MaxCharacters<12> = cast("" as string & DString.MaxCharacters<12>);

		const value2: string & DString.MaxCharacters<12> = cast("" as string & DString.MaxCharacters<6>);

		const value3: string & DString.MaxCharacters<12> = cast(
			"" as string & DString.MaxCharacters<15> & CastError<
				"Impossible to cast on MaxCharacters<12> because constraint MaxCharacters<15> from the value is more than.",
				string & DString.MaxCharacters<15>,
				DString.MaxCharacters<12>
			>,
		);
		// @ts-expect-error cause error
		const value35: string & DString.MaxCharacters<12> = cast("" as string & DString.MaxCharacters<15>);

		const value4: string & DString.MaxCharacters<12> = cast("" as string & DString.LengthEqual<12>);

		const value5: string & DString.MaxCharacters<12> = cast("" as string & DString.LengthEqual<6>);

		const value6: string & DString.MaxCharacters<12> = cast(
			"" as string & DString.LengthEqual<15> & CastError<
				"Impossible to cast on MaxCharacters<12> because constraint LengthEqual<15> from the value is more than.",
				string & DString.LengthEqual<15>,
				DString.MaxCharacters<12>
			>,
		);
		// @ts-expect-error cause error
		const value65: string & DString.MaxCharacters<12> = cast("" as string & DString.LengthEqual<15>);
	});

	it("cast minCharacters", () => {
		const value1: string & DString.MinCharacters<12> = cast("" as string & DString.MinCharacters<12>);

		const value2: string & DString.MinCharacters<12> = cast("" as string & DString.MinCharacters<15>);

		const value3: string & DString.MinCharacters<12> = cast(
			"" as string & DString.MinCharacters<6> & CastError<
				"Impossible to cast on MinCharacters<12> because constraint MinCharacters<6> from the value is less than.",
				string & DString.MinCharacters<6>,
				DString.MinCharacters<12>
			>,
		);

		const value4: string & DString.MinCharacters<12> = cast("" as string & DString.LengthEqual<12>);

		const value5: string & DString.MinCharacters<12> = cast("" as string & DString.LengthEqual<15>);

		const value6: string & DString.MinCharacters<12> = cast(
			"" as string & DString.LengthEqual<6> & CastError<
				"Impossible to cast on MaxCharacters<12> because constraint LengthEqual<6> from the value is less than.",
				string & DString.LengthEqual<6>,
				DString.MinCharacters<12>
			>,
		);
	});

	it("cast maxElements", () => {
		const value1: readonly unknown[] & DArray.MaxElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.MaxElements<12>,
		);

		const value2: readonly unknown[] & DArray.MaxElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.MaxElements<6>,
		);

		const value3: readonly unknown[] & DArray.MaxElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.MaxElements<15> & CastError<
				"Impossible to cast on MaxElements<12> because constraint MaxElements<15> from the value is more than.",
				readonly unknown[] & DArray.MaxElements<15>,
				DArray.MaxElements<12>
			>,
		);
		const value35: readonly unknown[] & DArray.MaxElements<12> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly unknown[] & DArray.MaxElements<15>,
		);

		const value4: readonly unknown[] & DArray.MaxElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<12>,
		);

		const value5: readonly unknown[] & DArray.MaxElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<6>,
		);

		const value6: readonly unknown[] & DArray.MaxElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<15> & CastError<
				"Impossible to cast on MaxElements<12> because constraint LengthEqual<15> from the value is more than.",
				readonly unknown[] & DArray.LengthEqual<15>,
				DArray.MaxElements<12>
			>,
		);
		const value65: readonly unknown[] & DArray.MaxElements<12> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly unknown[] & DArray.LengthEqual<15>,
		);
	});

	it("cast minElements", () => {
		const value1: readonly unknown[] & DArray.MinElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.MinElements<12>,
		);

		const value2: readonly unknown[] & DArray.MinElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.MinElements<15>,
		);

		const value3: readonly unknown[] & DArray.MinElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.MinElements<6> & CastError<
				"Impossible to cast on MinElements<12> because constraint MinElements<6> from the value is less than.",
				readonly unknown[] & DArray.MinElements<6>,
				DArray.MinElements<12>
			>,
		);
		const value35: readonly unknown[] & DArray.MinElements<12> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly unknown[] & DArray.MinElements<6>,
		);

		const value4: readonly unknown[] & DArray.MinElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<12>,
		);

		const value5: readonly unknown[] & DArray.MinElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<15>,
		);

		const value6: readonly unknown[] & DArray.MinElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<6> & CastError<
				"Impossible to cast on MinElements<12> because constraint LengthEqual<6> from the value is less than.",
				readonly unknown[] & DArray.LengthEqual<6>,
				DArray.MinElements<12>
			>,
		);
		const value65: readonly unknown[] & DArray.MinElements<12> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly unknown[] & DArray.LengthEqual<6>,
		);
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
