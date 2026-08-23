const segmentTrailingRegex = /\/$/;
const segmentRelativeRegex = /^(\.\/)/;

/**
 * @internal
 */
export function fix<
	GenericPath extends string,
>(
	path: GenericPath,
): string;

export function fix(
	path: string,
): string {
	return path
		.replace(segmentTrailingRegex, "")
		.replace(segmentRelativeRegex, "");
}
