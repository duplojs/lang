import type * as DCommon from "@scripts/common";

export interface Email extends DCommon.Constraint<"email"> {}

export const emailRegex = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;

export function isEmail<
	GenericValue extends string,
>(
	value: GenericValue,
): value is GenericValue & Email;

export function isEmail(
	value: string,
): any {
	return emailRegex.test(value);
}
