import type * as DCommon from "@scripts/common";
import type { ExtractGreaterThan, ExtractGreaterThanOrEqual, ExtractLessThan, ExtractLessThanOrEqual, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual } from "./constraints";
import type { IsGreater, IsGreaterOrEqual, RequireSimpleLiteral } from "./types";

type GreaterThanOrEqualOutput<
	GenericValue extends number,
	GenericThreshold extends number,
> = GenericValue extends unknown
	? ExtractLessThanOrEqual<GenericValue, unknown> extends LessThanOrEqual<infer InferredMax>
		? IsGreaterOrEqual<InferredMax, GenericThreshold> extends true
			? GenericValue & GreaterThanOrEqual<GenericThreshold>
			: never
		: ExtractLessThan<GenericValue, unknown> extends LessThan<infer InferredMax>
			? IsGreater<InferredMax, GenericThreshold> extends true
				? GenericValue & GreaterThanOrEqual<GenericThreshold>
				: never
			: ExtractGreaterThan<GenericValue, unknown> extends GreaterThan<infer InferredMin>
				? IsGreaterOrEqual<InferredMin, GenericThreshold> extends true
					? GenericValue
					: GenericValue & GreaterThanOrEqual<GenericThreshold>
				: ExtractGreaterThanOrEqual<GenericValue, unknown> extends GreaterThanOrEqual<infer InferredMin>
					? IsGreaterOrEqual<InferredMin, GenericThreshold> extends true
						? GenericValue
						: GenericValue & GreaterThanOrEqual<GenericThreshold>
					: GenericValue & GreaterThanOrEqual<GenericThreshold>
	: never;

type RequireApplyGreaterThanOrEqual<
	GenericThreshold extends number,
> = RequireSimpleLiteral<GenericThreshold>;

type RequireApplyGreaterThanOrEqualBoolean<
	GenericThreshold extends number,
> = DCommon.IsEqual<GenericThreshold, number> extends true
	? unknown
	: RequireApplyGreaterThanOrEqual<GenericThreshold>;

export function greaterThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireApplyGreaterThanOrEqual<GenericThreshold>,
): (
	value: GenericValue,
) => value is GreaterThanOrEqualOutput<GenericValue, GenericThreshold>;

export function greaterThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireApplyGreaterThanOrEqualBoolean<GenericThreshold>,
): (
	value: GenericValue,
) => boolean;

export function greaterThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireApplyGreaterThanOrEqual<GenericThreshold>,
): value is GreaterThanOrEqualOutput<GenericValue, GenericThreshold>;

export function greaterThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireApplyGreaterThanOrEqualBoolean<GenericThreshold>,
): boolean;

export function greaterThanOrEqual(
	...args:
		| [threshold: number]
		| [value: number, threshold: number]
): any {
	if (args.length === 1) {
		const [threshold] = args;

		return (value: number) => greaterThanOrEqual(value, threshold as never);
	}

	const [value, threshold] = args;

	return value >= threshold;
}
