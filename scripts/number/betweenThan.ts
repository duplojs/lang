import type * as DCommon from "@scripts/common";
import type { ExtractGreaterThan, ExtractGreaterThanOrEqual, ExtractLessThan, ExtractLessThanOrEqual, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual } from "./constraints";
import type { IsGreater, IsGreaterOrEqual, RequireSimpleLiteral } from "./types";

type ApplyGreaterThan<
	GenericValue extends number,
	GenericThreshold extends number,
> = GenericValue extends unknown
	? DCommon.And<[
		ExtractLessThanOrEqual<GenericValue, unknown> extends LessThanOrEqual<infer InferredMax>
			? IsGreater<InferredMax, GenericThreshold>
			: true,
		ExtractLessThan<GenericValue, unknown> extends LessThan<infer InferredMax>
			? IsGreater<InferredMax, GenericThreshold>
			: true,
	]> extends true
		? DCommon.Or<[
			ExtractGreaterThan<GenericValue, unknown> extends GreaterThan<infer InferredMin>
				? IsGreaterOrEqual<InferredMin, GenericThreshold>
				: false,
			ExtractGreaterThanOrEqual<GenericValue, unknown> extends GreaterThanOrEqual<infer InferredMin>
				? IsGreater<InferredMin, GenericThreshold>
				: false,
		]> extends true
			? GenericValue
			: GenericValue & GreaterThan<GenericThreshold>
		: never
	: never;

type ApplyLessThan<
	GenericValue extends number,
	GenericThreshold extends number,
> = GenericValue extends unknown
	? DCommon.And<[
		ExtractGreaterThan<GenericValue, unknown> extends GreaterThan<infer InferredMin>
			? IsGreater<GenericThreshold, InferredMin>
			: true,
		ExtractGreaterThanOrEqual<GenericValue, unknown> extends GreaterThanOrEqual<infer InferredMin>
			? IsGreater<GenericThreshold, InferredMin>
			: true,
	]> extends true
		? DCommon.Or<[
			ExtractLessThan<GenericValue, unknown> extends LessThan<infer InferredMax>
				? IsGreaterOrEqual<GenericThreshold, InferredMax>
				: false,
			ExtractLessThanOrEqual<GenericValue, unknown> extends LessThanOrEqual<infer InferredMax>
				? IsGreater<GenericThreshold, InferredMax>
				: false,
		]> extends true
			? GenericValue
			: GenericValue & LessThan<GenericThreshold>
		: never
	: never;

type BetweenThanOutput<
	GenericValue extends number,
	GenericGreater extends number,
	GenericLess extends number,
> = ApplyLessThan<
	ApplyGreaterThan<GenericValue, GenericGreater>,
	GenericLess
>;

export function betweenThan<
	GenericValue extends number,
	const GenericGreater extends number,
	const GenericLess extends number,
>(
	greater: GenericGreater & RequireSimpleLiteral<GenericGreater>,
	less: GenericLess & RequireSimpleLiteral<GenericLess>,
): (
	value: GenericValue,
) => value is BetweenThanOutput<GenericValue, GenericGreater, GenericLess>;

export function betweenThan<
	GenericValue extends number,
>(
	greater: number,
	less: number,
): (
	value: GenericValue,
) => boolean;

export function betweenThan<
	GenericValue extends number,
	const GenericGreater extends number,
	const GenericLess extends number,
>(
	value: GenericValue,
	greater: GenericGreater & RequireSimpleLiteral<GenericGreater>,
	less: GenericLess & RequireSimpleLiteral<GenericLess>,
): value is BetweenThanOutput<GenericValue, GenericGreater, GenericLess>;

export function betweenThan<
	GenericValue extends number,
>(
	value: GenericValue,
	greater: number,
	less: number,
): boolean;

export function betweenThan(
	...args:
		| [greater: number, less: number]
		| [value: number, greater: number, less: number]
): any {
	if (args.length === 2) {
		const [greater, less] = args;
		return (value: number) => betweenThan(value, greater as never, less as never);
	}

	const [value, greater, less] = args;

	return value > greater && value < less;
}
