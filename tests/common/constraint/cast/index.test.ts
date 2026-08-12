import { cast, type DArray, type DNumber, type CastError, type DString, shameOnYou, type ExpectType } from "@scripts";

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

		const value7: string & DString.MaxCharacters<12> = cast(
			"" as string & DString.MaxCharacters<15> & DString.LengthEqual<6>,
		);
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

		const value7: string & DString.MinCharacters<12> = cast(
			"" as string & DString.MinCharacters<6> & DString.LengthEqual<15>,
		);
	});

	it("cast string lengthEqual", () => {
		const value1: string & DString.LengthEqual<12> = cast("" as string & DString.LengthEqual<12>);

		const value2: string & DString.LengthEqual<12> = cast(
			"" as string & DString.LengthEqual<6> & CastError<
				"Impossible to cast on LengthEqual<12> because constraint LengthEqual<6> from the value is not equal.",
				string & DString.LengthEqual<6>,
				DString.LengthEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value25: string & DString.LengthEqual<12> = cast("" as string & DString.LengthEqual<6>);

		const value3: string & DString.LengthEqual<12> = cast(
			"" as string & DString.MaxCharacters<12> & CastError<
				"Impossible to cast on LengthEqual<12> because value does not have LengthEqual constraint.",
				string & DString.MaxCharacters<12>,
				DString.LengthEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value35: string & DString.LengthEqual<12> = cast("" as string & DString.MaxCharacters<12>);
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

		const value7: readonly unknown[] & DArray.MaxElements<2> = cast(
			[] as unknown as readonly [unknown, unknown],
		);

		const value8: readonly unknown[] & DArray.MaxElements<2> = cast(
			[] as unknown as readonly [unknown],
		);

		const value9: readonly unknown[] & DArray.MaxElements<2> = cast(
			[] as unknown as readonly [unknown, unknown, unknown] & CastError<
				"Impossible to cast on MaxElements<2> because constraint LengthEqual<3> from the value is more than.",
				readonly [unknown, unknown, unknown],
				DArray.MaxElements<2>
			>,
		);
		const value95: readonly unknown[] & DArray.MaxElements<2> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly [unknown, unknown, unknown],
		);

		const value10: readonly unknown[] & DArray.MaxElements<2> = cast(
			[] as unknown as readonly [unknown, ...unknown[]] & CastError<
				"Impossible to cast on MaxElements<2> because value does not have MaxElements constraint.",
				readonly [unknown, ...unknown[]],
				DArray.MaxElements<2>
			>,
		);
		const value105: readonly unknown[] & DArray.MaxElements<2> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly [unknown, ...unknown[]],
		);

		const value11: readonly unknown[] & DArray.MaxElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.MaxElements<15> & DArray.LengthEqual<6>,
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

		const value7: readonly unknown[] & DArray.MinElements<2> = cast(
			[] as unknown as readonly [unknown, unknown],
		);

		const value8: readonly unknown[] & DArray.MinElements<2> = cast(
			[] as unknown as readonly [unknown, unknown, unknown],
		);

		const value9: readonly unknown[] & DArray.MinElements<2> = cast(
			[] as unknown as readonly [unknown] & CastError<
				"Impossible to cast on MinElements<2> because constraint MinElements<1> from the value is less than.",
				readonly [unknown],
				DArray.MinElements<2>
			>,
		);
		const value95: readonly unknown[] & DArray.MinElements<2> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly [unknown],
		);

		const value10: readonly unknown[] & DArray.MinElements<2> = cast(
			[] as unknown as readonly [unknown, unknown, ...unknown[]],
		);

		const value11: readonly [unknown, ...unknown[]] = cast(
			[] as unknown as readonly unknown[] & DArray.MinElements<2>,
		);

		const value12: readonly [unknown, unknown, unknown, ...unknown[]] = cast(
			[] as unknown as readonly unknown[] & DArray.MinElements<2> & CastError<
				"Impossible to cast on MinElements<3> because constraint MinElements<2> from the value is less than.",
				readonly unknown[] & DArray.MinElements<2>,
				DArray.MinElements<3>
			>,
		);
		const value125: readonly [unknown, unknown, unknown, ...unknown[]] = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly unknown[] & DArray.MinElements<2>,
		);

		const value13: readonly [unknown, unknown] = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<2>,
		);

		const value14: readonly unknown[] & DArray.MinElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.MinElements<6> & DArray.LengthEqual<15>,
		);
	});

	it("cast array lengthEqual", () => {
		const value1: readonly unknown[] & DArray.LengthEqual<2> = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<2>,
		);

		const value2: readonly unknown[] & DArray.LengthEqual<2> = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<3> & CastError<
				"Impossible to cast on LengthEqual<2> because constraint LengthEqual<3> from the value is not equal.",
				readonly unknown[] & DArray.LengthEqual<3>,
				DArray.LengthEqual<2>
			>,
		);
		const value25: readonly unknown[] & DArray.LengthEqual<2> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly unknown[] & DArray.LengthEqual<3>,
		);

		const value3: readonly unknown[] & DArray.LengthEqual<2> = cast(
			[] as unknown as readonly [unknown, unknown],
		);

		const value4: readonly [unknown, unknown] = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<2>,
		);

		const value5: readonly unknown[] & DArray.LengthEqual<2> = cast(
			// @ts-expect-error cause error
			[] as unknown as [unknown, unknown, unknown],
		);

		const value6: readonly unknown[] & DArray.LengthEqual<2> = cast(
			[] as unknown as readonly unknown[] & DArray.MinElements<2> & CastError<
				"Impossible to cast on LengthEqual<2> because value does not have LengthEqual constraint.",
				readonly unknown[] & DArray.MinElements<2>,
				DArray.LengthEqual<2>
			>,
		);
		const value65: readonly unknown[] & DArray.LengthEqual<2> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly unknown[] & DArray.MinElements<2>,
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
		const value35: number & DNumber.GreaterThan<12> = cast(1 as number & DNumber.GreaterThan<6>);

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

		const value8: number & DNumber.GreaterThan<12> = cast(15);

		const value9: number & DNumber.GreaterThan<12> = cast(
			12 as 12 & CastError<
				"Impossible to cast on GreaterThan<12> because constraint GreaterThanOrEqual<12> from the value is less than or equal.",
				12,
				DNumber.GreaterThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value95: number & DNumber.GreaterThan<12> = cast(12);

		const value10: number & DNumber.GreaterThan<12> = cast(
			6 as 6 & CastError<
				"Impossible to cast on GreaterThan<12> because constraint GreaterThanOrEqual<6> from the value is less than or equal.",
				6,
				DNumber.GreaterThan<12>
			>,
		);
			// @ts-expect-error cause error
		const value105: number & DNumber.GreaterThan<12> = cast(6);

		const value11: number & DNumber.GreaterThan<12> = cast(
			1 as number & DNumber.GreaterThan<6> & DNumber.GreaterThanOrEqual<15>,
		);
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

		const value4: number & DNumber.GreaterThanOrEqual<12> = cast(1 as number & DNumber.GreaterThan<12>);

		const value5: number & DNumber.GreaterThanOrEqual<12> = cast(1 as number & DNumber.GreaterThan<15>);

		const value6: number & DNumber.GreaterThanOrEqual<12> = cast(
			1 as number & DNumber.GreaterThan<6> & CastError<
				"Impossible to cast on GreaterThanOrEqual<12> because constraint GreaterThan<6> from the value is less than.",
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

		const value8: number & DNumber.GreaterThanOrEqual<12> = cast(15);

		const value9: number & DNumber.GreaterThanOrEqual<12> = cast(12);

		const value10: number & DNumber.GreaterThanOrEqual<12> = cast(
			6 as 6 & CastError<
				"Impossible to cast on GreaterThanOrEqual<12> because constraint GreaterThanOrEqual<6> from the value is less than.",
				6,
				DNumber.GreaterThanOrEqual<12>
			>,
		);
			// @ts-expect-error cause error
		const value105: number & DNumber.GreaterThanOrEqual<12> = cast(6);

		const value11: number & DNumber.GreaterThanOrEqual<12> = cast(
			1 as number & DNumber.GreaterThanOrEqual<6> & DNumber.GreaterThan<12>,
		);
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

		const value8: number & DNumber.LessThan<12> = cast(6);

		const value9: number & DNumber.LessThan<12> = cast(
			12 as 12 & CastError<
				"Impossible to cast on LessThan<12> because constraint LessThanOrEqual<12> from the value is greater than or equal.",
				12,
				DNumber.LessThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value95: number & DNumber.LessThan<12> = cast(12);

		const value10: number & DNumber.LessThan<12> = cast(
			15 as 15 & CastError<
				"Impossible to cast on LessThan<12> because constraint LessThanOrEqual<15> from the value is greater than or equal.",
				15,
				DNumber.LessThan<12>
			>,
		);
			// @ts-expect-error cause error
		const value105: number & DNumber.LessThan<12> = cast(15);

		const value11: number & DNumber.LessThan<12> = cast(
			1 as number & DNumber.LessThan<15> & DNumber.LessThanOrEqual<6>,
		);
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

		const value5: number & DNumber.LessThanOrEqual<12> = cast(1 as number & DNumber.LessThan<6>);

		const value6: number & DNumber.LessThanOrEqual<12> = cast(
			1 as number & DNumber.LessThan<15> & CastError<
				"Impossible to cast on LessThanOrEqual<12> because constraint LessThan<15> from the value is greater than.",
				number & DNumber.LessThan<15>,
				DNumber.LessThanOrEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value65: number & DNumber.LessThanOrEqual<12> = cast(1 as number & DNumber.LessThan<15>);

		const value7: number & DNumber.LessThanOrEqual<12> = cast(
			1 as number & CastError<
				"Impossible to cast on LessThanOrEqual<12> because value does not have compatible constraint.",
				number,
				DNumber.LessThanOrEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value75: number & DNumber.LessThanOrEqual<12> = cast(1 as number);

		const value8: number & DNumber.LessThanOrEqual<12> = cast(6);

		const value9: number & DNumber.LessThanOrEqual<12> = cast(12);

		const value10: number & DNumber.LessThanOrEqual<12> = cast(
			15 as 15 & CastError<
				"Impossible to cast on LessThanOrEqual<12> because constraint LessThanOrEqual<15> from the value is greater than.",
				15,
				DNumber.LessThanOrEqual<12>
			>,
		);
			// @ts-expect-error cause error
		const value105: number & DNumber.LessThanOrEqual<12> = cast(15);

		const value11: number & DNumber.LessThanOrEqual<12> = cast(
			1 as number & DNumber.LessThanOrEqual<15> & DNumber.LessThan<12>,
		);
	});

	it("union value", () => {
		const value1: (
			| (number & DNumber.LessThanOrEqual<12>)
			| (string & DString.MaxCharacters<50>)
		) = cast(1 as number & DNumber.LessThanOrEqual<6>);

		const value2: (
			| (number & DNumber.LessThanOrEqual<12>)
			| (string & DString.MaxCharacters<50>)
		) = cast(
			1 as number & DNumber.LessThanOrEqual<15> & CastError<
				"Impossible to cast on LessThanOrEqual<12> because constraint LessThanOrEqual<15> from the value is greater than.",
				number & DNumber.LessThanOrEqual<15>,
				DNumber.LessThanOrEqual<12>
			>,
		);
		const value25: (
			| (number & DNumber.LessThanOrEqual<12>)
			| (string & DString.MaxCharacters<50>)
		// @ts-expect-error cause error
		) = cast(1 as number & DNumber.LessThanOrEqual<15>);

		const value3: (
			| (number & DNumber.LessThanOrEqual<12>)
			| (string & DString.MaxCharacters<50>)
		) = cast("" as string & DString.MaxCharacters<10>);

		const value4: (
			| (number & DNumber.LessThanOrEqual<12>)
			| (string & DString.MaxCharacters<50>)
		) = cast(
			"" as string & DString.MaxCharacters<100> & CastError<
				"Impossible to cast on MaxCharacters<50> because constraint MaxCharacters<100> from the value is more than.",
				string & DString.MaxCharacters<100>,
				DString.MaxCharacters<50>
			>,
		);
		const value45: (
			| (number & DNumber.LessThanOrEqual<12>)
			| (string & DString.MaxCharacters<50>)
		// @ts-expect-error cause error
		) = cast("" as string & DString.MaxCharacters<100>);

		const value5: (
			| (number & DNumber.LessThanOrEqual<12>)
			| (string & DString.MaxCharacters<50>)
		) = cast(
			"" as string & DString.MinCharacters<10> & CastError<
				"Impossible to cast on MaxCharacters<50> because value does not have MaxCharacters constraint.",
				string & DString.MinCharacters<10>,
				DString.MaxCharacters<50>
			>,
		);

		const value55: (
			| (number & DNumber.LessThanOrEqual<12>)
			| (string & DString.MaxCharacters<50>)
		// @ts-expect-error cause error
		) = cast("" as string & DString.MinCharacters<10>);

		const value6: string & DString.MaxCharacters<50> = cast(
			"" as (
				| (string & DString.MaxCharacters<20>)
				| (string & DString.MaxCharacters<30>)
			),
		);

		const value7: string & DString.MaxCharacters<50> = cast(
			"" as (
				| (string & DString.MaxCharacters<20>)
				| (string & DString.MaxCharacters<60>)
			) & CastError<
				"Impossible to cast on MaxCharacters<50> because constraint MaxCharacters<60> from the value is more than.",
				string & DString.MaxCharacters<60>,
				DString.MaxCharacters<50>
			>,
		);
		const value75: string & DString.MaxCharacters<50> = cast(
			// @ts-expect-error cause error
			"" as (
				| (string & DString.MaxCharacters<20>)
				| (string & DString.MaxCharacters<60>)
			),
		);

		const value8: (
			| (string & DString.MaxCharacters<50>)
			| (string & DString.NotEmpty)
		) = cast(
			"" as (
				| (string & DString.MaxCharacters<20>)
				| (string & DString.MinCharacters<20>)
			),
		);

		const value9: (
			| (string & DString.MaxCharacters<50>)
			| (string & DString.NotEmpty)
		) = cast(
			"" as (
				| (string & DString.MaxCharacters<20>)
				| (string & DString.MaxCharacters<100>)
			)
			& (
				| CastError<
					"Impossible to cast on MaxCharacters<50> because constraint MaxCharacters<100> from the value is more than.",
					string & DString.MaxCharacters<100>,
					DString.MaxCharacters<50>
				>
				| & CastError<
					"Impossible to cast on MinCharacters<1> because value does not have MinCharacters constraint.",
					string & DString.MaxCharacters<100>,
					DString.NotEmpty
				>
			),
		);
		const value95: (
			| (string & DString.MaxCharacters<50>)
			| (string & DString.NotEmpty)
		) = cast(
			// @ts-expect-error cause error
			"" as (
				| (string & DString.MaxCharacters<20>)
				| (string & DString.MaxCharacters<100>)
			),
		);

		const value10: (
			| (string & DString.MaxCharacters<50> & DString.NotEmpty)
			| (number & DNumber.GreaterThan<10> & DNumber.LessThan<100>)
			| (readonly unknown[] & DArray.MinElements<1> & DArray.MaxElements<10>)
		) = cast(
			"" as (
				| (string & DString.NotEmpty & DString.MaxCharacters<20>)
				| (number & DNumber.GreaterThan<20> & DNumber.LessThan<90>)
			),
		);

		const value11: (
			| (string & DString.MaxCharacters<50> & DString.NotEmpty)
			| (number & DNumber.GreaterThan<10> & DNumber.LessThan<100>)
			| (readonly unknown[] & DArray.MinElements<1> & DArray.MaxElements<10>)
		) = cast(
			"" as unknown as (
				| (string & DString.NotEmpty & DString.MaxCharacters<60>)
				| (number & DNumber.GreaterThan<1> & DNumber.LessThan<90>)
			)
			& (
				| CastError<
					"Impossible to cast on MaxCharacters<50> because constraint MaxCharacters<60> from the value is more than.",
					string & DString.NotEmpty & DString.MaxCharacters<60>,
					DString.MaxCharacters<50>
				>
				| CastError<
					"Impossible to cast on GreaterThan<10> because constraint GreaterThan<1> from the value is less than.",
					number & DNumber.GreaterThan<1> & DNumber.LessThan<90>,
					DNumber.GreaterThan<10>
				>
			),
		);
		const value115: (
				| (string & DString.MaxCharacters<50> & DString.NotEmpty)
				| (number & DNumber.GreaterThan<10> & DNumber.LessThan<100>)
				| (readonly unknown[] & DArray.MinElements<1> & DArray.MaxElements<10>)
		) = cast(
			// @ts-expect-error cause error
			"" as (
				| (string & DString.NotEmpty & DString.MaxCharacters<60>)
				| (number & DNumber.GreaterThan<1> & DNumber.LessThan<90>)
			),
		);

		const value12: (
				| (string & DString.MaxCharacters<50> & DString.NotEmpty)
				| (number & DNumber.GreaterThan<10> & DNumber.LessThan<100>)
				| (readonly unknown[] & DArray.MinElements<1> & DArray.MaxElements<10>)
		) = cast(
			"" as string & DString.NotEmpty & DString.MaxCharacters<60> & DString.LengthEqual<20>,
		);

		const value13: (
				| (string & DString.MaxCharacters<50> & DString.NotEmpty)
				| (number & DNumber.GreaterThan<10> & DNumber.LessThan<100>)
				| (readonly unknown[] & DArray.MinElements<1> & DArray.MaxElements<10>)
		) = cast(
			1 as number & DNumber.GreaterThan<1> & DNumber.GreaterThanOrEqual<20> & DNumber.LessThan<90>,
		);

		const value14: (
			| (string & DString.MaxCharacters<50> & DString.NotEmpty)
			| (number & DNumber.GreaterThan<10> & DNumber.LessThan<100>)
			| (readonly unknown[] & DArray.MinElements<1> & DArray.MaxElements<10>)
		) = cast(
			[] as unknown as (
				& readonly unknown[]
				& DArray.MinElements<0>
				& DArray.MaxElements<20>
				& DArray.LengthEqual<5>
			),
		);
	});

	it("cast value", () => {
		const value1: 1 | 2 | 3 = cast(1 as 1 | 2);

		const value2: number = cast(
			"" as "test" & CastError<
				"Input value are not Extends",
				"test",
				number
			>,
		);
		// @ts-expect-error cause error
		const value25: number = cast("" as "test");

		const value3: readonly ["test", 1, "test"] = cast(
			[] as unknown as readonly (string | number)[] & DArray.LengthEqual<3> & CastError<
				"Input value are not Extends",
				[string | number, string | number, string | number],
				readonly ["test", 1, "test"]
			>,
		);
		const value35: readonly ["test", 1, "test"] = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly (string | number)[] & DArray.LengthEqual<3>,
		);
	});

	it("shameOnYou bypasses expected constraints while preserving the raw input contract", () => {
		const value1 = shameOnYou<string & DString.MinCharacters<10>>("short");
		const value2 = shameOnYou<
			string & DString.MinCharacters<10> & DString.MaxCharacters<3>
		>("value");
		const value3 = shameOnYou<number & DNumber.GreaterThan<100>>(42);
		const value4 = shameOnYou<
			readonly unknown[] & DArray.MinElements<3>
		>([]);

		type _CheckValue1 = ExpectType<
			typeof value1,
			string & DString.MinCharacters<10>,
			"strict"
		>;
		type _CheckValue2 = ExpectType<
			typeof value2,
			string & DString.MinCharacters<10> & DString.MaxCharacters<3>,
			"strict"
		>;
		type _CheckValue3 = ExpectType<
			typeof value3,
			number & DNumber.GreaterThan<100>,
			"strict"
		>;
		type _CheckValue4 = ExpectType<
			typeof value4,
			readonly unknown[] & DArray.MinElements<3>,
			"strict"
		>;

		// @ts-expect-error the input must still match the expected raw value.
		shameOnYou<string & DString.MinCharacters<10>>(42);
		// @ts-expect-error the input must still match the expected raw tuple shape.
		shameOnYou<readonly [string, number]>(["value"]);

		expect(value1).toBe("short");
		expect(value2).toBe("value");
		expect(value3).toBe(42);
		expect(value4).toEqual([]);
	});
});
