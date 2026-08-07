import type * as DCommon from "@scripts/common";
import type { ReapplyAllSizeConstraints } from "./constraints";

type ToLowerCaseOutput<
	GenericString extends string,
> = ReapplyAllSizeConstraints<
	GenericString,
	Lowercase<Extract<DCommon.RemoveConstraint<GenericString>, string>>,
	"lengthEqual" | "maxCharacters"
>;

export function toLowerCase<
	GenericString extends string,
	GenericOutput = ToLowerCaseOutput<GenericString>,
>(
	string: GenericString,
): DCommon.BreakGenericLink<GenericOutput>;

export function toLowerCase(
	string: string,
) {
	return string.toLowerCase();
}
