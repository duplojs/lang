import type * as DCommon from "@scripts/common";

export interface MinLength<
	GenericMin extends number,
> extends DCommon.DynamicConstraint<"string-min-length", GenericMin> {}

export function minLength<
	GenericString extends string,
	GenericMin extends number,
>(
	min: GenericMin,
): (
	string: GenericString,
) => string is GenericString & MinLength<GenericMin>;

export function minLength<
	GenericString extends string,
	GenericMin extends number,
>(
	string: GenericString,
	min: GenericMin,
): string is GenericString & MinLength<GenericMin>;

export function minLength(
	...args:
		| [min: number]
		| [string: string, min: number]
): any {
	if (args.length === 1) {
		const [min] = args;

		return (string: string) => minLength(string, min);
	}

	const [string, min] = args;

	return string.length >= min;
}
