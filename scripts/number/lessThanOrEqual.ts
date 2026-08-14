import type * as DCommon from "@scripts/common";
import type { ExtractGreaterThan, ExtractGreaterThanOrEqual, ExtractLessThan, ExtractLessThanOrEqual, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual } from "./constraints";
import type { IsGreater, IsGreaterOrEqual, RequireSimpleLiteral } from "./types";

type LessThanOrEqualOutput<
	GenericValue extends number,
	GenericThreshold extends number,
> = GenericValue extends unknown
	? ExtractLessThanOrEqual<GenericValue, unknown> extends LessThanOrEqual<infer InferredMax>
		? IsGreaterOrEqual<GenericThreshold, InferredMax> extends true
			? GenericValue
			: GenericValue & LessThanOrEqual<GenericThreshold>
		: ExtractLessThan<GenericValue, unknown> extends LessThan<infer InferredMax>
			? IsGreaterOrEqual<GenericThreshold, InferredMax> extends true
				? GenericValue
				: GenericValue & LessThanOrEqual<GenericThreshold>
			: ExtractGreaterThan<GenericValue, unknown> extends GreaterThan<infer InferredMin>
				? IsGreater<GenericThreshold, InferredMin> extends true
					? GenericValue & LessThanOrEqual<GenericThreshold>
					: never
				: ExtractGreaterThanOrEqual<GenericValue, unknown> extends GreaterThanOrEqual<infer InferredMin>
					? IsGreaterOrEqual<GenericThreshold, InferredMin> extends true
						? GenericValue & LessThanOrEqual<GenericThreshold>
						: never
					: GenericValue & LessThanOrEqual<GenericThreshold>
	: never;

type RequireApplyLessThanOrEqual<
	GenericThreshold extends number,
> = RequireSimpleLiteral<GenericThreshold>;

type RequireApplyLessThanOrEqualBoolean<
	GenericThreshold extends number,
> = DCommon.IsEqual<GenericThreshold, number> extends true
	? unknown
	: RequireApplyLessThanOrEqual<GenericThreshold>;

export function lessThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireApplyLessThanOrEqual<GenericThreshold>,
): (
	value: GenericValue,
) => value is LessThanOrEqualOutput<GenericValue, GenericThreshold>;

export function lessThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireApplyLessThanOrEqualBoolean<GenericThreshold>,
): (
	value: GenericValue,
) => boolean;

export function lessThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireApplyLessThanOrEqual<GenericThreshold>,
): value is LessThanOrEqualOutput<GenericValue, GenericThreshold>;

export function lessThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireApplyLessThanOrEqualBoolean<GenericThreshold>,
): boolean;

export function lessThanOrEqual(
	...args:
		| [threshold: number]
		| [value: number, threshold: number]
): any {
	if (args.length === 1) {
		const [threshold] = args;

		return (value: number) => lessThanOrEqual(value, threshold as never);
	}

	const [value, threshold] = args;

	return value <= threshold;
}
