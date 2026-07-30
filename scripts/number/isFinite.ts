import type { Finite } from "./constraints";

export function isFinite<
	GenericNumber extends number,
>(
	number: GenericNumber,
): number is GenericNumber & Finite;

export function isFinite(
	number: number,
) {
	return Number.isFinite(number);
}
