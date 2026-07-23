import type * as DCommon from "@scripts/common";

export interface Positive extends DCommon.Constraint<"number-positive"> {}

export interface StrictPositive extends DCommon.Constraint<"number-strict-positive"> {}

export interface Negative extends DCommon.Constraint<"number-negative"> {}

export interface StrictNegative extends DCommon.Constraint<"number-strict-negative"> {}

export interface Integer extends DCommon.Constraint<"integer"> {}

export interface SafeInteger extends DCommon.Constraint<"safe-integer"> {}

export interface Finite extends DCommon.Constraint<"number-is-finite"> {}

export interface Even extends DCommon.Constraint<"even-number"> {}

export interface Odd extends DCommon.Constraint<"odd-number"> {}

export interface GreaterThan<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<"number-greater-than", GenericNumber> {}

export interface GreaterThanOrEqual<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<"number-greater-than-or-equal", GenericNumber> {}

export interface LessThan<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<"number-greater-less", GenericNumber> {}

export interface LessThanOrEqual<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<"number-greater-less-or-equal", GenericNumber> {}

export interface MultipleOf<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<"number-multiple-of", GenericNumber> {}
