import type * as DCommon from "@scripts/common";

export interface LengthEqual<
	GenericLength extends number,
> extends DCommon.DynamicConstraint<"string-length-equal", GenericLength> {}

export function lengthEqual<
	GenericString extends string,
	GenericLength extends number,
>(
	length: GenericLength,
): (
	string: GenericString,
) => string is GenericString & LengthEqual<GenericLength>;

export function lengthEqual<
	GenericString extends string,
	GenericLength extends number,
>(
	string: GenericString,
	length: GenericLength,
): string is GenericString & LengthEqual<GenericLength>;

export function lengthEqual(
	...args:
		| [length: number]
		| [string: string, length: number]
): any {
	if (args.length === 1) {
		const [length] = args;

		return (string: string) => lengthEqual(string, length);
	}

	const [string, length] = args;

	return string.length === length;
}
