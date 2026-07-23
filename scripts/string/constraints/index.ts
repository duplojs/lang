import type * as DCommon from "@scripts/common";

export interface Email extends DCommon.Constraint<"email"> {}

export interface LengthEqual<
	GenericLength extends number,
> extends DCommon.DynamicConstraint<"string-length-equal", GenericLength> {}

export interface MaxLength<
	GenericMax extends number,
> extends DCommon.DynamicConstraint<"string-max-length", GenericMax> {}

export interface MinLength<
	GenericMin extends number,
> extends DCommon.DynamicConstraint<"string-min-length", GenericMin> {}

export interface Trimmed extends DCommon.Constraint<"string-trimmed"> {}

export interface NotBlank extends DCommon.Constraint<"string-not-blank"> {}

export interface NonEmpty extends DCommon.Constraint<"string-not-blank"> {}

export interface Url extends DCommon.Constraint<"url"> {}

export interface Uuid extends DCommon.Constraint<"uuid"> {}

export interface Includes<
	GenericSearch extends string,
> extends DCommon.DynamicConstraint<"string-includes", GenericSearch> {}
