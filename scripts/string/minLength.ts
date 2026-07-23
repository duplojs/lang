import type { MinLength } from "./constraints";

export function minLength<
	GenericValue extends string,
	GenericMin extends number,
>(
	min: GenericMin,
): (
	value: GenericValue,
) => value is GenericValue & MinLength<GenericMin>;

export function minLength<
	GenericValue extends string,
	GenericMin extends number,
>(
	value: GenericValue,
	min: GenericMin,
): value is GenericValue & MinLength<GenericMin>;

export function minLength(
	...args:
		| [min: number]
		| [value: string, min: number]
): any {
	if (args.length === 1) {
		const [min] = args;

		return (value: string) => minLength(value, min);
	}

	const [value, min] = args;

	return value.length >= min;
}
