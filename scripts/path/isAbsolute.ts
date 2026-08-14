import type { Absolute, Path } from "./constraints";

const containBackPathRegex = /(^|\/)\.\.(?=\/|$)/;
const nullCharacter = String.fromCharCode(0);
const posixAbsolutePathRegex = /^\/(?:$|[^/]+(?:\/[^/]+)*(?:\/+)?$)/;

export function isAbsolute<
	GenericPath extends string,
>(
	path: GenericPath,
): path is GenericPath & Path & Absolute;

export function isAbsolute(
	path: string,
): any {
	return !path.includes(nullCharacter)
		&& posixAbsolutePathRegex.test(path)
		&& !containBackPathRegex.test(path);
}
