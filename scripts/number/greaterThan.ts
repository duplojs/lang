import type { ExtractGreaterThan, ExtractGreaterThanOrEqual, ExtractLessThan, ExtractLessThanOrEqual, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual } from "./constraints";
import type { IsGreater, IsGreaterOrEqual, RequireLiteral } from "./types";

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

export function greaterThan<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireLiteral<GenericThreshold>,
): (
	value: GenericValue,
) => value is GreaterThanOutput<GenericValue, GenericThreshold>;

export function greaterThan<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireLiteral<GenericThreshold>,
): value is GreaterThanOutput<GenericValue, GenericThreshold>;

export function greaterThan(
	...args:
		| [threshold: number]
		| [value: number, threshold: number]
) {
	if (args.length === 1) {
		const [threshold] = args;

		return (value: number) => greaterThan(value, threshold as never);
	}

	const [value, threshold] = args;

	return value > threshold;
}
