import * as DCommon from "@scripts/common";
import type { Right } from "./create";
import { isRight } from "./is";

export function unwrapRight<
	GenericInput extends unknown,
>(
	input: GenericInput,
): GenericInput extends Right
	? DCommon.Unwrap<GenericInput>
	: GenericInput;

export function unwrapRight(
	input: unknown,
) {
	if (isRight(input)) {
		return DCommon.unwrap(input);
	}

	return input;
}
