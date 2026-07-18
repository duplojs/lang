import * as DCommon from "@scripts/common";
import { informationKind } from "../kind";
import { rightKind, type Right } from "./create";

/**
 * {@include either/isRight/index.md}
 */
export function isRight<
	GenericInput extends unknown,
>(
	input: GenericInput,
): input is Extract<GenericInput, Right>;

export function isRight(
	input: unknown,
) {
	return rightKind.has(input)
		&& informationKind.has(input)
		&& DCommon.isWrappedValue(input);
}
