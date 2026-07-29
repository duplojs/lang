import { TheDate } from "../theDate";
import { toNative } from "../toNative";
import type { SerializedTheDate } from "../types";

export function subtractMonths<
	GenericDate extends TheDate | SerializedTheDate,
	GenericMonth extends number,
>(
	month: GenericMonth,
): (
	date: GenericDate,
) => TheDate;

export function subtractMonths<
	GenericDate extends TheDate | SerializedTheDate,
	GenericMonth extends number,
>(
	date: GenericDate,
	month: GenericMonth,
): TheDate;

export function subtractMonths(
	...args:
		| [month: number]
		| [date: TheDate | SerializedTheDate, month: number]
) {
	if (args.length === 1) {
		const [month] = args;

		return (date: TheDate | SerializedTheDate) => subtractMonths(date, month);
	}

	const [date, month] = args;

	const date = toNative(date);
	date.setUTCMonth(date.getUTCMonth() - month);

	return TheDate.new(date.getTime());
}
