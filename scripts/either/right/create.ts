import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { createEitherKind, informationKind } from "../kind";

export const rightKind = createEitherKind("right");

type _Right<
	GenericInformation extends string = string,
	GenericValue extends unknown = unknown,
> = (
	& DKind.Kind<typeof rightKind>
	& DKind.Kind<
		typeof informationKind,
		GenericInformation
	>
	& DCommon.WrappedValue<GenericValue>
);

export interface Right<
	GenericInformation extends string = string,
	GenericValue extends unknown = unknown,
> extends _Right<GenericInformation, GenericValue> {

}

/**
 * {@include either/right/index.md}
 */
export function right<
	GenericInformation extends string,
	const GenericValue extends unknown = undefined,
>(
	information: GenericInformation,
	value?: GenericValue,
): Right<
	GenericInformation,
	GenericValue
>;

export function right(
	information: string,
	value: unknown = undefined,
) {
	return rightKind.setTo(
		informationKind.setTo(
			DCommon.wrapValue(value),
			information,
		),
		null,
	);
}
