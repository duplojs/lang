import type * as DCommon from "@scripts/common";
import type { Even } from "../even";
import type { ExtractGreaterThan, GreaterThan } from "../greaterThan";
import type { ExtractGreaterThanOrEqual, GreaterThanOrEqual } from "../greaterThanOrEqual";
import type { Integer } from "../integer";
import type { Odd } from "../odd";
import type { Positive } from "../positive";
import type { SafeInteger } from "../safeInteger";
import type { StrictPositive } from "../strictPositive";

type IsPositiveLiteral<
	GenericNumber extends number,
> = DCommon.RemoveConstraint<GenericNumber> extends infer InferredNumber extends number
	? DCommon.IsEqual<InferredNumber, number> extends true
		? false
		: `${InferredNumber}` extends `-${string}`
			? false
			: true
	: false;

type HasPositiveConstraint<
	GenericNumber extends number,
> = DCommon.Or<[
	DCommon.IsExtends<GenericNumber, Positive | StrictPositive>,
	ExtractGreaterThan<GenericNumber, unknown> extends GreaterThan<infer InferredMin>
		? IsPositiveLiteral<InferredMin>
		: false,
	ExtractGreaterThanOrEqual<GenericNumber, unknown> extends GreaterThanOrEqual<infer InferredMin>
		? IsPositiveLiteral<InferredMin>
		: false,
]>;

type HasIntegerConstraint<
	GenericNumber extends number,
> = DCommon.IsExtends<GenericNumber, Integer | SafeInteger | Odd | Even>;

type IsIntegerLiteral<
	GenericNumber extends number,
> = DCommon.RemoveConstraint<GenericNumber> extends infer InferredNumber extends number
	? DCommon.IsEqual<InferredNumber, number> extends true
		? false
		: `${InferredNumber}` extends `${number}.${number}`
			? false
			: true
	: false;

export type IsPositiveInteger<
	GenericNumber extends number,
> = DCommon.And<[
	DCommon.Or<[
		HasPositiveConstraint<GenericNumber>,
		IsPositiveLiteral<GenericNumber>,
	]>,
	DCommon.Or<[
		HasIntegerConstraint<GenericNumber>,
		IsIntegerLiteral<GenericNumber>,
	]>,
]>;
