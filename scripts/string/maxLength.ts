import type * as DCommon from "@scripts/common";

export interface MaxLength<
	GenericMax extends number,
> extends DCommon.Constraint<`string-max-length-${GenericMax}`> {}

export function maxLength<
	GenericInput extends string,
	GenericMax extends number,
>(
	max: GenericMax,
): (input: GenericInput) => input is GenericInput & MaxLength<GenericMax>;

export function maxLength<
	GenericInput extends string,
	GenericMax extends number,
>(
	input: GenericInput,
	max: GenericMax,
): input is GenericInput & MaxLength<GenericMax>;

export function maxLength(
	...args: [input: string, max: number] | [max: number]
): any {
	if (args.length === 1) {
		const [max] = args;

		return (input: string) => maxLength(input, max);
	}

	const [input, max] = args;

	return input.length <= max;
}
