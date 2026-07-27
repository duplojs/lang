import type * as DCommon from "@scripts/common";
import type { ReapplyAllSizeConstraints } from "./constraints";

type CapitalizeOutput<
	GenericString extends string,
> = DCommon.RemoveConstraint<GenericString> extends infer InferredString extends string
	? ReapplyAllSizeConstraints<
		GenericString,
		Capitalize<InferredString>,
		"lengthEqual" | "maxCharacters"
	>
	: never;

export function capitalize<
	GenericString extends string,
>(
	string: GenericString,
): CapitalizeOutput<GenericString>;

export function capitalize(
	string: string,
) {
	return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}
