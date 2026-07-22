import type * as DCommon from "@scripts/common";

export interface MaxLength<
	GenericMax extends number,
> extends DCommon.DynamicConstraint<"string-max-length", GenericMax> {}

export function maxLength<
	GenericValue extends string,
	GenericMax extends number,
>(
	max: GenericMax,
): (
	value: GenericValue,
) => value is GenericValue & MaxLength<GenericMax>;

export function maxLength<
	GenericValue extends string,
	GenericMax extends number,
>(
	value: GenericValue,
	max: GenericMax,
): value is GenericValue & MaxLength<GenericMax>;

export function maxLength(
	...args:
		| [max: number]
		| [value: string, max: number]
): any {
	if (args.length === 1) {
		const [max] = args;

		return (value: string) => maxLength(value, max);
	}

	const [value, max] = args;

	return value.length <= max;
}
