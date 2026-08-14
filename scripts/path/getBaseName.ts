import type { Path } from "./constraints";

const baseNameRegex = /\/?([^/]+)$/;
const extensionNameRegex = /\.([^./]+)$/;
const segmentTrailingRegex = /\/+$/;

export interface GetBaseNameParams {
	removeExtension?: boolean;
}

export function getBaseName<
	GenericPath extends string & Path,
>(
	path: GenericPath,
	params?: GetBaseNameParams,
): string;

export function getBaseName(
	path: string,
	params?: GetBaseNameParams,
) {
	const fixedPath = path.replace(segmentTrailingRegex, "");
	const baseName = baseNameRegex.exec(fixedPath)?.[1] ?? "";

	if (params?.removeExtension) {
		return baseName.replace(extensionNameRegex, "");
	}

	return baseName;
}
