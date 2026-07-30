import type * as DCommon from "@scripts/common";
import type { GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual, RequireLiteralNumber } from "./constraints";
import type { IsGreater, IsGreaterOrEqual } from "./types";

type ApplyGreaterThanOrEqual<
	GenericValue extends number,
	GenericThreshold extends number,
> = GenericValue extends unknown
	? DCommon.And<[
		GenericValue extends LessThanOrEqual<infer InferredMax>
			? IsGreaterOrEqual<InferredMax, GenericThreshold>
			: true,
		GenericValue extends LessThan<infer InferredMax>
			? IsGreater<InferredMax, GenericThreshold>
			: true,
	]> extends true
		? DCommon.Or<[
			GenericValue extends GreaterThan<infer InferredMin>
				? IsGreaterOrEqual<InferredMin, GenericThreshold>
				: false,
			GenericValue extends GreaterThanOrEqual<infer InferredMin>
				? IsGreaterOrEqual<InferredMin, GenericThreshold>
				: false,
		]> extends true
			? GenericValue
			: GenericValue & GreaterThanOrEqual<GenericThreshold>
		: never
	: never;

type ApplyLessThanOrEqual<
	GenericValue extends number,
	GenericThreshold extends number,
> = GenericValue extends unknown
	? DCommon.And<[
		GenericValue extends GreaterThan<infer InferredMin>
			? IsGreater<GenericThreshold, InferredMin>
			: true,
		GenericValue extends GreaterThanOrEqual<infer InferredMin>
			? IsGreaterOrEqual<GenericThreshold, InferredMin>
			: true,
	]> extends true
		? DCommon.Or<[
			GenericValue extends LessThan<infer InferredMax>
				? IsGreaterOrEqual<GenericThreshold, InferredMax>
				: false,
			GenericValue extends LessThanOrEqual<infer InferredMax>
				? IsGreaterOrEqual<GenericThreshold, InferredMax>
				: false,
		]> extends true
			? GenericValue
			: GenericValue & LessThanOrEqual<GenericThreshold>
		: never
	: never;

type BetweenThanOrEqualOutput<
	GenericValue extends number,
	GenericGreater extends number,
	GenericLess extends number,
> = ApplyLessThanOrEqual<
	ApplyGreaterThanOrEqual<GenericValue, GenericGreater>,
	GenericLess
>;

export function betweenThanOrEqual<
	GenericValue extends number,
	const GenericGreater extends number,
	const GenericLess extends number,
>(
	greater: GenericGreater & RequireLiteralNumber<GenericGreater>,
	less: GenericLess & RequireLiteralNumber<GenericLess>,
): (
	value: GenericValue,
) => value is BetweenThanOrEqualOutput<GenericValue, GenericGreater, GenericLess>;

export function betweenThanOrEqual<
	GenericValue extends number,
	const GenericGreater extends number,
	const GenericLess extends number,
>(
	value: GenericValue,
	greater: GenericGreater & RequireLiteralNumber<GenericGreater>,
	less: GenericLess & RequireLiteralNumber<GenericLess>,
): value is BetweenThanOrEqualOutput<GenericValue, GenericGreater, GenericLess>;

export function betweenThanOrEqual(
	...args:
		| [greater: number, less: number]
		| [value: number, greater: number, less: number]
): any {
	if (args.length === 2) {
		const [greater, less] = args;

		return (value: number) => betweenThanOrEqual(value, greater as never, less as never);
	}

	const [value, greater, less] = args;

	return value >= greater && value <= less;
}
