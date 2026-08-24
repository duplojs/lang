import type { Absolute, Path } from "./constraints";

const baseNameRegex = /([^/]+)$/;
const extensionNameRegex = /(?<!^)\.[^./]+$/;

export interface GetBaseNameParams {
	removeExtension?: boolean;
}

export function getBaseName<
	GenericPath extends string & (Path | Absolute),
>(
	path: GenericPath,
	params?: GetBaseNameParams,
): string | null;

export function getBaseName(
	path: string,
	params?: GetBaseNameParams,
) {
	const baseName = baseNameRegex.exec(path)?.[1];

	if (baseName === undefined) {
		return null;
	}

	return params?.removeExtension
		? baseName.replace(extensionNameRegex, "")
		: baseName;
}
