import type * as DCommon from "@scripts/common";
import type { ReapplyAllSizeConstraints } from "./constraints";

type ToLowerCaseOutput<
	GenericString extends string,
> = DCommon.RemoveConstraint<GenericString> extends infer InferredString extends string
	? ReapplyAllSizeConstraints<
		GenericString,
		Lowercase<InferredString>,
		"lengthEqual" | "maxCharacters"
	>
	: never;

export function toLowerCase<
	GenericString extends string,
>(
	string: GenericString,
): ToLowerCaseOutput<GenericString>;

export function toLowerCase(
	string: string,
) {
	return string.toLowerCase();
}
