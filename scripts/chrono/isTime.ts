import { TheTime } from "./theTime";

export function isTime(
	input: unknown,
): input is TheTime {
	if (input instanceof TheTime) {
		return true;
	}

	return false;
}
