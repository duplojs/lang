import * as DCommon from "@scripts/common";
import * as DKind from "@scripts/kind";
import type { Right } from "./create";
import { isRight } from "./is";
import { createEitherKind } from "../kind";

export class NotRightError extends DKind.parentClass(
	createEitherKind("not-right-error"),
	Error,
) {
	public constructor(
		public value: unknown,
	) {
		super(undefined, "Value is not Right.");
	}
}

/**
 * {@include either/unwrapRightOrThrow/index.md}
 */
export function unwrapRightOrThrow<
	GenericInput extends unknown,
>(
	input: GenericInput,
): DCommon.Unwrap<Extract<GenericInput, Right>>;

export function unwrapRightOrThrow(
	input: unknown,
) {
	if (isRight(input)) {
		return DCommon.unwrap(input);
	}

	throw new NotRightError(input);
}
