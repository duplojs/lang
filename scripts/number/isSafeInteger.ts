import type { SafeInteger } from "./constraints";

export function isSafeInteger<
	GenericNumber extends number,
>(
	number: GenericNumber,
): number is GenericNumber & SafeInteger;

export function isSafeInteger(
	number: number,
) {
	return Number.isSafeInteger(number);
}
