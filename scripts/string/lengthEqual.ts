import type * as DCommon from "@scripts/common";

export interface LengthEqual<
	GenericLength extends number,
> extends DCommon.DynamicConstraint<"string-length-equal", GenericLength> {}

export function lengthEqual<
	GenericValue extends string,
	GenericLength extends number,
>(
	length: GenericLength,
): (
	value: GenericValue,
) => value is GenericValue & LengthEqual<GenericLength>;

export function lengthEqual<
	GenericValue extends string,
	GenericLength extends number,
>(
	value: GenericValue,
	length: GenericLength,
): value is GenericValue & LengthEqual<GenericLength>;

export function lengthEqual(
	...args:
		| [length: number]
		| [value: string, length: number]
): any {
	if (args.length === 1) {
		const [length] = args;

		return (value: string) => lengthEqual(value, length);
	}

	const [value, length] = args;

	return value.length === length;
}
