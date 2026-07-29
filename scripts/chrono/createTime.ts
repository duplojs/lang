import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import { TheTime } from "./theTime";
import { isoTimeRegex, type maxTimeValue, millisecondInOneHour, millisecondInOneMinute, millisecondInOneWeek, millisecondsInOneDay, millisecondsInOneSecond, type minTimeValue, serializeTheTimeRegex } from "./constants";
import { isSafeTimeValue } from "./isSafeTimeValue";
import type { SerializedTheTime, SpoolingTime } from "./types";

export type MayBeTime = DEither.Right<"time-created", TheTime> | DEither.Left<"time-created-error", null>;

type ChronoCreateTimeUnit = "week" | "day" | "hour" | "minute" | "second" | "millisecond";

const unitMapper: Record<ChronoCreateTimeUnit, number> = {
	week: millisecondInOneWeek,
	day: millisecondsInOneDay,
	hour: millisecondInOneHour,
	minute: millisecondInOneMinute,
	second: millisecondsInOneSecond,
	millisecond: 1,
};

type ForbiddenTime<
	GenericInput extends number,
	GenericUnit extends ChronoCreateTimeUnit,
> = DCommon.IsEqual<GenericInput, number> extends true
	? DCommon.ComputedTypeError<"Expect only literal value.">
	: (
		& (
			DCommon.IsEqual<GenericUnit, "millisecond"> extends true
				? DCommon.And<[
					DNumber.IsGreater<GenericInput, typeof minTimeValue>,
					DNumber.IsLess<GenericInput, typeof maxTimeValue>,
				]> extends true
					? GenericInput
					: DCommon.ComputedTypeError<"Support that the milliseconds between -9007199254740991 and 9007199254740991.">
				: GenericInput
		)
		& (
			DCommon.IsEqual<GenericUnit, "second"> extends true
				? DCommon.And<[
					DNumber.IsGreater<GenericInput, -9007199254740>,
					DNumber.IsLess<GenericInput, 9007199254740>,
				]> extends true
					? GenericInput
					: DCommon.ComputedTypeError<"Support that the seconds between -9007199254740 and 9007199254740.">
				: GenericInput
		)
		& (
			DCommon.IsEqual<GenericUnit, "minute"> extends true
				? DCommon.And<[
					DNumber.IsGreater<GenericInput, -150119987579>,
					DNumber.IsLess<GenericInput, 150119987579>,
				]> extends true
					? GenericInput
					: DCommon.ComputedTypeError<"Support that the minutes between -150119987579 and 150119987579.">
				: GenericInput
		)
		& (
			DCommon.IsEqual<GenericUnit, "hour"> extends true
				? DCommon.And<[
					DNumber.IsGreater<GenericInput, -2501999792>,
					DNumber.IsLess<GenericInput, 2501999792>,
				]> extends true
					? GenericInput
					: DCommon.ComputedTypeError<"Support that the hours between -2501999792 and 2501999792.">
				: GenericInput
		)
		& (
			DCommon.IsEqual<GenericUnit, "day"> extends true
				? DCommon.And<[
					DNumber.IsGreater<GenericInput, -104249991>,
					DNumber.IsLess<GenericInput, 104249991>,
				]> extends true
					? GenericInput
					: DCommon.ComputedTypeError<"Support that the days between -104249991 and 104249991.">
				: GenericInput
		)
		& (
			DCommon.IsEqual<GenericUnit, "week"> extends true
				? DCommon.And<[
					DNumber.IsGreater<GenericInput, -14892855>,
					DNumber.IsLess<GenericInput, 14892855>,
				]> extends true
					? GenericInput
					: DCommon.ComputedTypeError<"Support that the weeks between -14892855 and 14892855.">
				: GenericInput
	)
	);

export function createTime<
	GenericInput extends number,
	GenericUnit extends ChronoCreateTimeUnit = "millisecond",
>(
	input: GenericInput & ForbiddenTime<GenericInput, GenericUnit>,
	unit: GenericUnit,
): TheTime;

export function createTime<
	GenericInput extends number | TheTime | SpoolingTime | SerializedTheTime,
>(
	input: GenericInput,
): MayBeTime;

export function createTime(
	input: SpoolingTime | number | string | TheTime,
	unit?: ChronoCreateTimeUnit,
) {
	if (input instanceof TheTime) {
		return input;
	}

	if (typeof input === "number") {
		if (unit) {
			return TheTime.new(input * unitMapper[unit]);
		}
		return createFromTimeValue(input * unitMapper[unit ?? "millisecond"]);
	}

	if (typeof input === "string") {
		const serializeTheTimeMatch = input.match(serializeTheTimeRegex);

		if (!serializeTheTimeMatch) {
			return DEither.left("time-created-error", null);
		}

		const { value, sign } = serializeTheTimeMatch.groups as Record<"value" | "sign", string>;

		return createFromTimeValue(
			Number(
				sign === "-"
					? `-${value}`
					: value,
			),
		);
	}

	const {
		value = 0,
		week = 0,
		day = 0,
		hour = 0,
		minute = 0,
		second = 0,
		millisecond = 0,
	} = input;

	let fromValue = 0;
	if (typeof value === "number") {
		fromValue = value;
	} else {
		const theTimeMatch = value.match(isoTimeRegex);
		if (theTimeMatch) {
			const {
				sign = "+",
				hour,
				minute,
				second = 0,
				millisecond = 0,
			} = theTimeMatch!.groups as Partial<
				Record<
					"sign" | "hour" | "minute" | "second" | "millisecond",
					string
				>
			>;

			fromValue = (Number(hour) * millisecondInOneHour)
			+ (Number(minute) * millisecondInOneMinute)
			+ (Number(second) * millisecondsInOneSecond)
			+ Number(millisecond);

			fromValue = sign === "-"
				? -fromValue
				: fromValue;
		}
	}

	return createFromTimeValue(
		fromValue
		+ (week * millisecondInOneWeek)
		+ (day * millisecondsInOneDay)
		+ (hour * millisecondInOneHour)
		+ (minute * millisecondInOneMinute)
		+ (second * millisecondsInOneSecond)
		+ millisecond,
	);
}

function createFromTimeValue(timeValue: number): MayBeTime {
	if (!isSafeTimeValue(timeValue)) {
		return DEither.left("time-created-error", null);
	}

	return DEither.right(
		"time-created",
		TheTime.new(timeValue),
	);
}
