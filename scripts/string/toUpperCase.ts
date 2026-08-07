import type * as DCommon from "@scripts/common";
import type { ReapplyAllSizeConstraints } from "./constraints";

type ToUpperCaseOutput<
	GenericString extends string,
> = ReapplyAllSizeConstraints<
	GenericString,
	Uppercase<Extract<DCommon.RemoveConstraint<GenericString>, string>>,
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
