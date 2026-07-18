import * as DCommon from "@scripts/common";
import type { Left } from "./create";
import { isLeft } from "./is";

/**
 * {@include either/unwrapLeft/index.md}
 */
export function unwrapLeft<
	GenericInput extends unknown,
>(
	input: GenericInput,
): GenericInput extends Left
	? DCommon.Unwrap<GenericInput>
	: GenericInput;

export function unwrapLeft(
	input: unknown,
) {
	if (isLeft(input)) {
		return DCommon.unwrap(input);
	}

	return input;
}
