import { TheDate } from "./theDate";
import { toTimestamp } from "./toTimestamp";
import type { SerializedTheDate } from "./types";

export function maxDate<
	GenericDates extends (TheDate | SerializedTheDate)[],
>(
	dates: GenericDates,
): TheDate;

export function maxDate(
	dates: (TheDate | SerializedTheDate)[],
) {
	return TheDate.new(
		Math.max(
			...dates.map(toTimestamp),
		),
	);
}
