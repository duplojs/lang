import type { Absolute, Path } from "./constraints";

const folderNameRegex = /([^]+)\/[^/]+\/?$/;

export function getParentFolderPath<
	GenericPath extends string & Path & Absolute,
>(
	path: GenericPath,
): string;

export function getParentFolderPath<
	GenericPath extends string & Path,
>(
	path: GenericPath,
): string;

export function getParentFolderPath(
	path: string,
): string {
	const match = path.match(folderNameRegex);

	if (!match) {
		return "";
	}

	return match[1]!;
}
