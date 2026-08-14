import type { Path } from "./constraints";

const nullCharacter = String.fromCharCode(0);
const posixPathRegex = /^(?:\/|\/?[^/]+(?:\/[^/]+)*(?:\/+)?)$/;

export function is<
	GenericPath extends string,
>(
	path: GenericPath,
): path is GenericPath & Path;

export function is(
	path: string,
): any {
	return !path.includes(nullCharacter)
		&& posixPathRegex.test(path);
}
