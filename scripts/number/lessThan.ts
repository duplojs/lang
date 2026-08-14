import type { ExtractGreaterThan, ExtractGreaterThanOrEqual, ExtractLessThan, ExtractLessThanOrEqual, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual } from "./constraints";
import type { IsGreater, IsGreaterOrEqual, RequireSimpleLiteral } from "./types";

type LessThanOutput<
	GenericValue extends number,
	GenericThreshold extends number,
> = GenericValue extends unknown
	? ExtractLessThanOrEqual<GenericValue, unknown> extends LessThanOrEqual<infer InferredMax>
		? IsGreater<GenericThreshold, InferredMax> extends true
			? GenericValue
			: GenericValue & LessThan<GenericThreshold>
		: ExtractLessThan<GenericValue, unknown> extends LessThan<infer InferredMax>
			? IsGreaterOrEqual<GenericThreshold, InferredMax> extends true
				? GenericValue
				: GenericValue & LessThan<GenericThreshold>
			: ExtractGreaterThan<GenericValue, unknown> extends GreaterThan<infer InferredMin>
				? IsGreater<GenericThreshold, InferredMin> extends true
					? GenericValue & LessThan<GenericThreshold>
					: never
				: ExtractGreaterThanOrEqual<GenericValue, unknown> extends GreaterThanOrEqual<infer InferredMin>
					? IsGreater<GenericThreshold, InferredMin> extends true
						? GenericValue & LessThan<GenericThreshold>
						: never
					: GenericValue & LessThan<GenericThreshold>
	: never;

export function lessThan<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireSimpleLiteral<GenericThreshold>,
): (
	value: GenericValue,
) => value is LessThanOutput<GenericValue, GenericThreshold>;

export function lessThan<
	GenericValue extends number,
>(
	threshold: number,
): (
	value: GenericValue,
) => boolean;

export function lessThan<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireSimpleLiteral<GenericThreshold>,
): value is LessThanOutput<GenericValue, GenericThreshold>;

export function lessThan<
	GenericValue extends number,
>(
	value: GenericValue,
	threshold: number,
): boolean;

export function lessThan(
	...args:
		| [threshold: number]
		| [value: number, threshold: number]
): any {
	if (args.length === 1) {
		const [threshold] = args;

		return (value: number) => lessThan(value, threshold as never);
	}

	const [value, threshold] = args;

	return value < threshold;
}
