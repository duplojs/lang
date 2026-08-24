import type { Absolute, Path } from "./constraints";

const basenameRegex = /([^/]+)$/;

export interface GetExtensionNameParams {
	withDot?: boolean;
}

export function getExtensionName<
	GenericPath extends string & (Path | Absolute),
>(
	path: GenericPath,
	params?: GetExtensionNameParams,
) {
	const baseName = basenameRegex.exec(path)?.[1];

	if (
		!baseName
		|| baseName === "."
		|| baseName === ".."
	) {
		return null;
	}

	const dotIndex = baseName.lastIndexOf(".");

	if (dotIndex <= 0 || dotIndex === baseName.length - 1) {
		return null;
	}

	const extension = baseName.slice(dotIndex + 1);

	return params?.withDot
		? `.${extension}`
		: extension;
}
