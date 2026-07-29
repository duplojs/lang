import type * as DCommon from "@scripts/common";
import { TheTime } from "./theTime";
import type { SerializedTheTime } from "./types";
import { toTimeValue } from "./toTimeValue";

export function maxTime<
	GenericTimes extends DCommon.AnyTuple<TheTime | SerializedTheTime>,
>(
	times: GenericTimes,
): TheTime;

export function maxTime(
	times: DCommon.AnyTuple<TheTime | SerializedTheTime>,
) {
	return TheTime.new(
		Math.max(
			...times.map(toTimeValue),
		),
	);
}
