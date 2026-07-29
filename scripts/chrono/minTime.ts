import type * as DCommon from "@scripts/common";
import { TheTime } from "./theTime";
import { toTimeValue } from "./toTimeValue";
import type { SerializedTheTime } from "./types";

export function minTime<
	GenericTimes extends DCommon.AnyTuple<TheTime | SerializedTheTime>,
>(
	times: GenericTimes,
): TheTime;

export function minTime(
	times: DCommon.AnyTuple<TheTime | SerializedTheTime>,
) {
	return TheTime.new(
		Math.min(
			...times.map(toTimeValue),
		),
	);
}
