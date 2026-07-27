import type * as DCommon from "@scripts/common";
import type { ReapplyAllSizeConstraints } from "./constraints";

type UncapitalizeOutput<
	GenericString extends string,
> = DCommon.RemoveConstraint<GenericString> extends infer InferredString extends string
	? ReapplyAllSizeConstraints<
		GenericString,
		Uncapitalize<InferredString>,
		"lengthEqual" | "maxCharacters"
	>
	: never;

export function uncapitalize<
	GenericString extends string,
>(
	string: GenericString,
): UncapitalizeOutput<GenericString>;

export function uncapitalize(
	string: string,
) {
	return `${string.charAt(0).toLowerCase()}${string.slice(1)}`;
}
