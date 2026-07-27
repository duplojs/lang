import type * as DCommon from "@scripts/common";
import type { ReapplyAllSizeConstraints } from "./constraints";

type ToUpperCaseOutput<
	GenericString extends string,
> = DCommon.RemoveConstraint<GenericString> extends infer InferredString extends string
	? ReapplyAllSizeConstraints<
		GenericString,
		Uppercase<InferredString>,
		"lengthEqual" | "maxCharacters"
	>
	: never;

export function toUpperCase<
	GenericString extends string,
>(
	string: GenericString,
): ToUpperCaseOutput<GenericString>;

export function toUpperCase(
	string: string,
) {
	return string.toUpperCase();
}
