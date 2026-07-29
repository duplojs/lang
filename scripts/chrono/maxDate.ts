import type * as DCommon from "@scripts/common";
import { TheDate } from "./theDate";
import { toTimestamp } from "./toTimestamp";
import type { SerializedTheDate } from "./types";

export function maxDate<
	GenericDates extends DCommon.AnyTuple<TheDate | SerializedTheDate>,
>(
	dates: GenericDates,
): TheDate;

export function maxDate(
	dates: DCommon.AnyTuple<TheDate | SerializedTheDate>,
) {
	return TheDate.new(
		Math.max(
			...dates.map(toTimestamp),
		),
	);
}
