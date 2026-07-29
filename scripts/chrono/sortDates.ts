import type * as DCommon from "@scripts/common";
import { toTimestamp } from "./toTimestamp";
import { TheDate } from "./theDate";
import type { SerializedTheDate } from "./types";

export function sortDates<
	GenericDates extends readonly (TheDate | SerializedTheDate)[],
>(
	type: DCommon.SortType,
): (
	dates: GenericDates,
) => TheDate[];

export function sortDates<
	GenericDates extends readonly (TheDate | SerializedTheDate)[],
>(
	dates: GenericDates,
	type: DCommon.SortType,
): TheDate[];

export function sortDates(
	...args:
		| [type: DCommon.SortType]
		| [dates: readonly (TheDate | SerializedTheDate)[], type: DCommon.SortType]
) {
	if (args.length === 1) {
		const [type] = args;

		return (dates: readonly (TheDate | SerializedTheDate)[]) => sortDates(dates, type);
	}

	const [dates, type] = args;

	return dates
		.map(toTimestamp)
		.sort(
			type === "DSC"
				? (first, second) => second - first
				: (first, second) => first - second,
		)
		.map(TheDate.new);
}
