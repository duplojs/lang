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

export function greaterThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireSimpleLiteral<GenericThreshold>,
): (
	value: GenericValue,
) => value is GreaterThanOrEqualOutput<GenericValue, GenericThreshold>;

export function greaterThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireSimpleLiteral<GenericThreshold>,
): value is GreaterThanOrEqualOutput<GenericValue, GenericThreshold>;

export function greaterThanOrEqual(
	...args:
		| [threshold: number]
		| [value: number, threshold: number]
) {
	if (args.length === 1) {
		const [threshold] = args;

		return (value: number) => greaterThanOrEqual(value, threshold as never);
	}

	const [value, threshold] = args;

	return value >= threshold;
}
