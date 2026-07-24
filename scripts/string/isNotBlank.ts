import type { NotBlank } from "./constraints";

export function isNotBlank<
	GenericValue extends string,
>(
	string: GenericValue,
): string is GenericValue & NotBlank;

export function isNotBlank(
	string: string,
) {
	return string.trim().length > 0;
}

