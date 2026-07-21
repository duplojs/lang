import { TheDate } from "./theDate";

export function isDate(
	input: unknown,
): input is TheDate {
	if (input instanceof TheDate) {
		return true;
	}

	return false;
}
