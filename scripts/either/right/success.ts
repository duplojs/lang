import type * as DKind from "@scripts/kind";
import { createEitherKind } from "../kind";
import { right, type Right } from "./create";

export const successKind = createEitherKind("success");

type _Success<
	GenericValue extends unknown = unknown,
> = (
	& Right<"success", GenericValue>
	& DKind.Kind<typeof successKind>
);

export interface Success<
	GenericValue extends unknown = unknown,
> extends _Success<GenericValue> {

}

export function success<
	const GenericValue extends unknown,
>(
	value: GenericValue,
): Success<GenericValue>;

export function success(
	value: unknown,
) {
	return successKind.setTo(
		right("success", value),
		null,
	);
}
