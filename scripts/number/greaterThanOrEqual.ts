import type { GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual, RequireLiteralNumber } from "./constraints";
import type { IsGreater, IsGreaterOrEqual } from "./types";

type GreaterThanOrEqualOutput<
	GenericValue extends number,
	GenericThreshold extends number,
> = GenericValue extends LessThanOrEqual<infer InferredMax>
	? IsGreaterOrEqual<InferredMax, GenericThreshold> extends true
		? GenericValue & GreaterThanOrEqual<GenericThreshold>
		: never
	: GenericValue extends LessThan<infer InferredMax>
		? IsGreater<InferredMax, GenericThreshold> extends true
			? GenericValue & GreaterThanOrEqual<GenericThreshold>
			: never
		: GenericValue extends GreaterThan<infer InferredMin>
			? IsGreaterOrEqual<InferredMin, GenericThreshold> extends true
				? GenericValue
				: GenericValue & GreaterThanOrEqual<GenericThreshold>
			: GenericValue extends GreaterThanOrEqual<infer InferredMin>
				? IsGreaterOrEqual<InferredMin, GenericThreshold> extends true
					? GenericValue
					: GenericValue & GreaterThanOrEqual<GenericThreshold>
				: GenericValue & GreaterThanOrEqual<GenericThreshold>;

export function greaterThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireLiteralNumber<GenericThreshold>,
): (
	value: GenericValue,
) => value is GreaterThanOrEqualOutput<GenericValue, GenericThreshold>;

export function greaterThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireLiteralNumber<GenericThreshold>,
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
