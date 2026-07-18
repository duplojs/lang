import type * as DKind from "@scripts/kind";
import { createEitherKind } from "../kind";
import { left, type Left } from "./create";

export const errorKind = createEitherKind("error");

type _Error<
	GenericValue extends unknown = unknown,
> = (
	& Left<"error", GenericValue>
	& DKind.Kind<typeof errorKind>
);

export interface Error<
	GenericValue extends unknown = unknown,
> extends _Error<GenericValue> {

}

/**
 * {@include either/error/index.md}
 */
export function error<
	const GenericValue extends unknown,
>(
	value: GenericValue,
): Error<GenericValue>;

export function error(
	value: unknown,
) {
	return errorKind.setTo(
		left("error", value),
		null,
	);
}
