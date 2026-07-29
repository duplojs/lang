import type * as DCommon from "@scripts/common";
import { toTimestamp } from "./toTimestamp";
import { TheDate } from "./theDate";
import type { SerializedTheDate } from "./types";

export function minDate<
	GenericDates extends DCommon.AnyTuple<TheDate | SerializedTheDate>,
>(
	dates: GenericDates,
): TheDate;

export function minDate(
	dates: DCommon.AnyTuple<TheDate | SerializedTheDate>,
) {
	return TheDate.new(
		Math.min(
			...dates.map(toTimestamp),
		),
	);
}
