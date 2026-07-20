
import { TheDate } from "./theDate";
import type { TheTime } from "./theTime";
import type { SerializedTheTime, SerializedTheDate } from "./types";

export function serialize(
	input: TheDate,
): SerializedTheDate;

export function serialize(
	input: TheTime,
): SerializedTheTime;

export function serialize(
	input: TheDate | TheTime,
) {
	if (input instanceof TheDate) {
		const timestamp = input.getTime();

		return `date${Math.abs(timestamp)}${timestamp > 0 ? "+" : "-"}`;
	}

	const number = input.toNative();

	return `time${Math.abs(number)}${number > 0 ? "+" : "-"}`;
}
