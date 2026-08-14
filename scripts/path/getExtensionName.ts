import type { Path } from "./constraints";

const extensionNameRegex = /\.([^./]+)$/;

export interface GetExtensionNameParams {
	withDot?: boolean;
}

export function getExtensionName<
	GenericPath extends string & Path,
>(
	path: GenericPath,
	params?: GetExtensionNameParams,
): string;

export function getExtensionName(
	path: string,
	params?: GetExtensionNameParams,
): string {
	const match = extensionNameRegex.exec(path);

	if (match) {
		return params?.withDot
			? `.${match[1]!}`
			: match[1]!;
	}

	return "";
}
