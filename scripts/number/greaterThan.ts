import type * as DCommon from "@scripts/common";
import type { ExtractGreaterThan, ExtractGreaterThanOrEqual, ExtractLessThan, ExtractLessThanOrEqual, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual } from "./constraints";
import type { IsGreater, IsGreaterOrEqual, RequireSimpleLiteral } from "./types";

type GreaterThanOutput<
	GenericValue extends number,
	GenericThreshold extends number,
> = GenericValue extends unknown
	? ExtractLessThanOrEqual<GenericValue, unknown> extends LessThanOrEqual<infer InferredMax>
		? IsGreater<InferredMax, GenericThreshold> extends true
			? GenericValue & GreaterThan<GenericThreshold>
			: never
		: ExtractLessThan<GenericValue, unknown> extends LessThan<infer InferredMax>
			? IsGreater<InferredMax, GenericThreshold> extends true
				? GenericValue & GreaterThan<GenericThreshold>
				: never
			: ExtractGreaterThan<GenericValue, unknown> extends GreaterThan<infer InferredMin>
				? IsGreaterOrEqual<InferredMin, GenericThreshold> extends true
					? GenericValue
					: GenericValue & GreaterThan<GenericThreshold>
				: ExtractGreaterThanOrEqual<GenericValue, unknown> extends GreaterThanOrEqual<infer InferredMin>
					? IsGreater<InferredMin, GenericThreshold> extends true
						? GenericValue
						: GenericValue & GreaterThan<GenericThreshold>
					: GenericValue & GreaterThan<GenericThreshold>
	: never;

type RequireApplyGreaterThan<
	GenericThreshold extends number,
> = RequireSimpleLiteral<GenericThreshold>;

type RequireApplyGreaterThanBoolean<
	GenericThreshold extends number,
> = DCommon.IsEqual<GenericThreshold, number> extends true
	? unknown
	: RequireApplyGreaterThan<GenericThreshold>;

export function greaterThan<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireApplyGreaterThan<GenericThreshold>,
): (
	value: GenericValue,
) => value is GreaterThanOutput<GenericValue, GenericThreshold>;

export function greaterThan<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireApplyGreaterThanBoolean<GenericThreshold>,
): (
	value: GenericValue,
) => boolean;

export function greaterThan<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireApplyGreaterThan<GenericThreshold>,
): value is GreaterThanOutput<GenericValue, GenericThreshold>;

export function greaterThan<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireApplyGreaterThanBoolean<GenericThreshold>,
): boolean;

export function greaterThan(
	...args:
		| [threshold: number]
		| [value: number, threshold: number]
): any {
	if (args.length === 1) {
		const [threshold] = args;

		return (value: number) => greaterThan(value, threshold as never);
	}

	const [value, threshold] = args;

	return value > threshold;
}
