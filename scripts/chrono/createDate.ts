import * as DEither from "@scripts/either";
import type * as DCommon from "@scripts/common";
import type * as DString from "@scripts/string";
import { isoDateRegex, serializeTheDateRegex } from "./constants";
import { isSafeTimestamp } from "./isSafeTimestamp";
import { applyTimezone } from "./applyTimezone";
import { isDate } from "./isDate";
import { toNative } from "./toNative";
import { TheDate } from "./theDate";
import type { Hour, IsLeapYear, IsSafeYear, Millisecond, Minute, Second, MonthWithDay, SpoolingDate, SerializedTheDate } from "./types";

export type MayBe = DEither.Right<"date-created", TheDate> | DEither.Left<"date-created-error", null>;

type SafeDate = `${number}-${MonthWithDay}`;

type ForbiddenDate<
	GenericDate extends string,
> = DCommon.And<[
	DCommon.IsExtends<GenericDate, SafeDate>,
	DCommon.Not<DCommon.IsEqual<GenericDate, SafeDate>>,
]> extends true
	? (
		& (
			DString.Includes<GenericDate, "."> extends true
				? DCommon.ComputedTypeError<"Year can't be includes a float number.">
				: GenericDate
		)
		& (
			GenericDate extends `${infer InferredYear extends number}-02-29`
				? IsLeapYear<InferredYear> extends true
					? GenericDate
					: DCommon.ComputedTypeError<"Is not a leap year.">
				: GenericDate
		)
		& (
			GenericDate extends `${infer InferredYear extends number}-${MonthWithDay}`
				? IsSafeYear<InferredYear> extends true
					? GenericDate
					: DCommon.ComputedTypeError<"Support that the years between -271820 and 275759.">
				: GenericDate
		)
	)
	: GenericDate;

export interface CreateSafeDateParams {
	hour?: Hour;
	minute?: Minute;
	second?: Second;
	millisecond?: Millisecond;
}

const safeDateRegex = /^(?<year>-?[0-9]+)-(?<monthWithDay>[0-1][0-9]-[0-3][0-9])$/;

export function createDate<
	GenericInput extends TheDate | Date | number | SerializedTheDate,
>(
	input: GenericInput,
): MayBe;

export function createDate<
	GenericInput extends SpoolingDate,
>(
	input: GenericInput,
): MayBe;

export function createDate<
	GenericInput extends SafeDate,
>(
	input: GenericInput & ForbiddenDate<GenericInput>,
	params?: CreateSafeDateParams,
): TheDate;

export function createDate(
	input: TheDate | Date | number | string | SpoolingDate,
	params?: CreateSafeDateParams,
): MayBe | TheDate {
	if (typeof input === "number") {
		return createFromTimestamp(input);
	}

	if (input instanceof Date) {
		return createFromTimestamp(input.getTime());
	}

	const serializeTheDateMatch = typeof input === "string" && input.match(serializeTheDateRegex);

	if (serializeTheDateMatch) {
		const { value, sign } = serializeTheDateMatch.groups as Record<"value" | "sign", string>;

		return createFromTimestamp(Number(
			sign === "-"
				? `-${value}`
				: value,
		));
	}

	const safeDateMatch = typeof input === "string" && input.match(safeDateRegex);

	if (safeDateMatch) {
		const { year, monthWithDay } = safeDateMatch.groups as Record<"year" | "monthWithDay", string>;
		const date = new Date(
			`0004-${monthWithDay}T${params?.hour ?? "00"}:${params?.minute ?? "00"}:${params?.second ?? "00"}.${params?.millisecond ?? "000"}Z`,
		);

		date.setUTCFullYear(Number(year));

		return TheDate.new(date.getTime());
	}

	if (typeof input === "object") {
		let inputValueResult: MayBe | undefined = undefined;

		const serializeTheDateMatch = typeof input.value === "string" && input.value.match(serializeTheDateRegex);

		if (serializeTheDateMatch) {
			const { value, sign } = serializeTheDateMatch.groups as Record<"value" | "sign", string>;

			inputValueResult = createFromTimestamp(Number(
				sign === "-"
					? `-${value}`
					: value,
			));
		} else if (isDate(input.value)) {
			inputValueResult = DEither.right("date-created", input.value);
		} else if (input.value instanceof Date) {
			inputValueResult = createFromTimestamp(input.value.getTime());
		} else if (typeof input.value === "number") {
			inputValueResult = createFromTimestamp(input.value);
		} else {
			const isoDateMatch = input.value.match(isoDateRegex);
			if (isoDateMatch) {
				const { year, month, date, hour, minute, second, millisecond } = isoDateMatch.groups as Partial<
					Record<
						"year" | "month" | "date" | "hour" | "minute" | "second" | "millisecond",
						string
					>
				>;

				inputValueResult = createFromTimestamp(
					Date.UTC(
						Number(year),
						Number(month) - 1,
						Number(date),
						typeof hour === "string"
							? Number(hour)
							: 0,
						typeof minute === "string"
							? Number(minute)
							: 0,
						typeof second === "string"
							? Number(second)
							: 0,
						typeof millisecond === "string"
							? Number(millisecond)
							: 0,
					),
				);
			}
		}

		if (!inputValueResult || DEither.isLeft(inputValueResult)) {
			return inputValueResult || DEither.left("date-created-error", null);
		}

		const date = toNative(
			DEither.unwrapRight(inputValueResult),
		);

		void (input.year && date.setUTCFullYear(input.year));
		void (input.month && date.setMonth(input.month));
		void (input.day && date.setDate(input.day));
		void (input.hour && date.setHours(input.hour));
		void (input.minute && date.setMinutes(input.minute));
		void (input.second && date.setSeconds(input.second));
		void (input.millisecond && date.setMilliseconds(input.millisecond));

		const result = createFromTimestamp(date.getTime());

		if (DEither.isLeft(result)) {
			return result;
		}

		const timezone = input.timezone;

		if (!timezone) {
			return result;
		}

		return DEither.whenIsLeft(
			DEither.safeCallback(
				() => DEither.right(
					"date-created",
					applyTimezone(DEither.unwrapRight(result), timezone),
				),
			),
			() => DEither.left("date-created-error", null),
		);
	}

	return DEither.left("date-created-error", null);
}

function createFromTimestamp(timestamp: number): MayBe {
	if (!isSafeTimestamp(timestamp)) {
		return DEither.left("date-created-error", null);
	}

	return DEither.right(
		"date-created",
		TheDate.new(timestamp),
	);
}
