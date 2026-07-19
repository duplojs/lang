import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { createEitherKind, informationKind } from "../kind";

export const leftKind = createEitherKind("left");

type _Left<
	GenericInformation extends string = string,
	GenericValue extends unknown = unknown,
> = (
	& DKind.Kind<typeof leftKind>
	& DKind.Kind<
		typeof informationKind,
		GenericInformation
	>
	& DCommon.WrappedValue<GenericValue>
);

export interface Left<
	GenericInformation extends string = string,
	GenericValue extends unknown = unknown,
> extends _Left<GenericInformation, GenericValue> {

}

export function left<
	GenericInformation extends string,
	const GenericValue extends unknown = undefined,
>(
	information: GenericInformation,
	value?: GenericValue,
): Left<
	GenericInformation,
	GenericValue
>;

export function left(
	information: string,
	value: unknown = undefined,
) {
	return leftKind.setTo(
		informationKind.setTo(
			DCommon.wrapValue(value),
			information,
		),
		null,
	);
}
