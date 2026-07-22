import type * as DCommon from "@scripts/common";

export interface MaxLength<
	GenericMax extends number,
> extends DCommon.DynamicConstraint<"string-max-length", GenericMax> {}

export function maxLength<
	GenericString extends string,
	GenericMax extends number,
>(
	max: GenericMax,
): (
	string: GenericString,
) => string is GenericString & MaxLength<GenericMax>;

export function maxLength<
	GenericString extends string,
	GenericMax extends number,
>(
	string: GenericString,
	max: GenericMax,
): string is GenericString & MaxLength<GenericMax>;

export function maxLength(
	...args:
		| [max: number]
		| [string: string, max: number]
): any {
	if (args.length === 1) {
		const [max] = args;

		return (string: string) => maxLength(string, max);
	}

	const [string, max] = args;

	return string.length <= max;
}
