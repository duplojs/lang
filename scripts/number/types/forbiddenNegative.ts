import type * as DCommon from "@scripts/common";
import type { IsPositive } from "./isPositive";

export type ForbiddenNegative<
	GenericNumber extends number,
> = IsPositive<GenericNumber> extends true
	? GenericNumber
	: DCommon.ComputedTypeError<"Only positive number is allowed.">;
