import type { MultipleOf } from "./constraints";
import type { RequireSimpleLiteral } from "./types";

export function isMultipleOf<
	GenericValue extends number,
	const GenericMultiple extends number,
>(
	multiple: GenericMultiple & RequireSimpleLiteral<GenericMultiple>,
): (
	value: GenericValue,
) => value is GenericValue & MultipleOf<GenericMultiple>;

export function isMultipleOf<
	GenericValue extends number,
>(
	multiple: number,
): (
	value: GenericValue,
) => boolean;

export function isMultipleOf<
	GenericValue extends number,
	const GenericMultiple extends number,
>(
	value: GenericValue,
	multiple: GenericMultiple & RequireSimpleLiteral<GenericMultiple>,
): value is GenericValue & MultipleOf<GenericMultiple>;

export function isMultipleOf<
	GenericValue extends number,
>(
	value: GenericValue,
	multiple: number,
): boolean;

export function isMultipleOf(
	...args:
		| [multiple: number]
		| [value: number, multiple: number]
): any {
	if (args.length === 1) {
		const [multiple] = args;

		return (value: number) => isMultipleOf(value, multiple as never);
	}

	const [value, multiple] = args;

	return value % multiple === 0;
}
