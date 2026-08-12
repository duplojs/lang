import type * as DCommon from "@scripts/common";

export type RequireTuple<
	GenericValue extends unknown,
> = GenericValue extends DCommon.AnyTuple
	? unknown
	: DCommon.ComputedTypeError<"Expected value must be en Tuple">;
