import { toTimestamp } from "./toTimestamp";
import { TheDate } from "./theDate";
import type { SerializedTheDate } from "./types";

export function minDate<
	GenericDates extends (TheDate | SerializedTheDate)[],
>(
	dates: GenericDates,
): TheDate;

export function minDate(
	dates: (TheDate | SerializedTheDate)[],
) {
	return TheDate.new(
		Math.min(
			...dates.map(toTimestamp),
		),
	);
}
