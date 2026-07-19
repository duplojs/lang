import type * as DCommon from "@scripts/common";
import { type AssignObjects } from "./types";

export function assign<
	GenericInput extends object,
	GenericValue extends Partial<Record<keyof GenericInput, unknown>> & DCommon.AnyObject,
>(
	value: GenericValue,
): (input: GenericInput) => AssignObjects<GenericInput, GenericValue>;

export function assign<
	GenericInput extends object,
	GenericValue extends Partial<Record<keyof GenericInput, unknown>> & DCommon.AnyObject,
>(
	input: GenericInput,
	value: GenericValue,
): AssignObjects<GenericInput, GenericValue>;

export function assign(...args: [object, object] | [object]) {
	if (args.length === 1) {
		const [value] = args;

		return (input: object) => assign(input, value);
	}

	const [input, value] = args;
	return {
		...input,
		...value,
	} as never;
}
