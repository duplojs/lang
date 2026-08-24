import type { Absolute, Path } from "./constraints";

const parentFolderPathRegex = /^([^]*)\/[^/]+$/;
const onlyParentsRegex = /^(?:\.\.)(?:\/\.\.)*$/;

export function getParentFolderPath<
	GenericPath extends string & (Path | Absolute),
>(
	path: GenericPath,
): string | null;

export function getParentFolderPath(
	path: string,
) {
	const parent = parentFolderPathRegex.exec(path)?.[1];

	if (
		parent === undefined
		|| parent === ""
		|| onlyParentsRegex.test(parent)
	) {
		return path.startsWith("/") && parent === ""
			? "/"
			: null;
	}

	return parent;
}
