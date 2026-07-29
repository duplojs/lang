import { TheTime } from "./theTime";
import { toTimeValue } from "./toTimeValue";
import type { SerializedTheTime } from "./types";

export function minTime<
	GenericTimes extends (TheTime | SerializedTheTime)[],
>(
	times: GenericTimes,
): TheTime;

export function minTime(
	times: (TheTime | SerializedTheTime)[],
) {
	return TheTime.new(
		Math.min(
			...times.map(toTimeValue),
		),
	);
}
