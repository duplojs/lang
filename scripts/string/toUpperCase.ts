import type * as DCommon from "@scripts/common";
import type { ReapplyAllSizeConstraints } from "./constraints";

type ToUpperCaseOutput<
	GenericString extends string,
> = ReapplyAllSizeConstraints<
	GenericString,
	Uppercase<DCommon.RemoveConstraint<GenericString>>,
	"lengthEqual" | "maxCharacters"
>;

export function toUpperCase<
	GenericString extends string,
	GenericOutput = ToUpperCaseOutput<GenericString>,
>(
	string: GenericString,
): DCommon.BreakGenericLink<GenericOutput>;

export function toUpperCase(
	string: string,
) {
	return string.toUpperCase();
}
