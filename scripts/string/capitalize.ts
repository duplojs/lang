import type * as DCommon from "@scripts/common";
import type { ReapplyAllSizeConstraints } from "./constraints";

type CapitalizeOutput<
	GenericString extends string,
> = ReapplyAllSizeConstraints<
	GenericString,
	Capitalize<DCommon.RemoveConstraint<GenericString>>,
	"lengthEqual" | "maxCharacters"
>;

export function capitalize<
	GenericString extends string,
	GenericOutput = CapitalizeOutput<GenericString>,
>(
	string: GenericString,
): DCommon.BreakGenericLink<GenericOutput>;

export function capitalize(
	string: string,
) {
	return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}
