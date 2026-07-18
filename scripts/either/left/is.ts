import * as DCommon from "@scripts/common";
import { leftKind, type Left } from "./create";
import { informationKind } from "../kind";

/**
 * {@include either/isLeft/index.md}
 */
export function isLeft<
	GenericInput extends unknown,
>(
	input: GenericInput,
): input is Extract<GenericInput, Left>;

export function isLeft(
	input: unknown,
) {
	return leftKind.has(input)
		&& informationKind.has(input)
		&& DCommon.isWrappedValue(input);
}
