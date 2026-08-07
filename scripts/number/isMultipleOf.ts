import type { MultipleOf } from "./constraints";
import type { RequireLiteral } from "./types";

export function isMultipleOf<
	GenericValue extends number,
	const GenericMultiple extends number,
>(
	multiple: GenericMultiple,
): (
	value: GenericValue,
) => value is GenericValue & MultipleOf<GenericMultiple>;

export function isMultipleOf<
	GenericValue extends number,
	const GenericMultiple extends number,
>(
	value: GenericValue,
	multiple: GenericMultiple & RequireLiteral<GenericMultiple>,
): value is GenericValue & MultipleOf<GenericMultiple>;

export function isMultipleOf(
	...args:
		| [multiple: number]
		| [value: number, multiple: number]
) {
	if (args.length === 1) {
		const [multiple] = args;

		return (value: number) => isMultipleOf(value, multiple as never);
	}

	const [value, multiple] = args;

	return value % multiple === 0;
}
