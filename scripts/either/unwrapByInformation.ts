import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import type { Left } from "./left";
import type { Right } from "./right";
import { valueKind, type informationKind } from "./kind";
import { hasInformation } from "./hasInformation";
import type {
	GetInformation,
	GetValue,
} from "./types";

type Either = Right | Left;

export function unwrapByInformation<
	GenericInput extends unknown,
	const GenericInformation extends (
		GenericInput extends Either
			? GetInformation<GenericInput>
			: never
	),
>(
	information: GenericInformation | GenericInformation[],
): (
	input: GenericInput,
) => GenericInput extends DKind.Kind<typeof informationKind, GenericInformation>
	? GetValue<Extract<GenericInput, Either>>
	: GenericInput;

export function unwrapByInformation<
	GenericInput extends unknown,
	GenericInformation extends(
		GenericInput extends Either
			? GetInformation<GenericInput>
			: never
	),
>(
	input: GenericInput,
	information: GenericInformation | GenericInformation[],
): GenericInput extends DKind.Kind<typeof informationKind, GenericInformation>
	? GetValue<Extract<GenericInput, Either>>
	: GenericInput;

export function unwrapByInformation(
	...args:
		| [information: DCommon.MaybeArray<string>]
		| [input: unknown, information: DCommon.MaybeArray<string>]
): any {
	if (args.length === 1) {
		const [information] = args;

		return (input: unknown) => unwrapByInformation(
			input,
			information as never,
		);
	}

	const [input, information] = args;

	if (hasInformation(input, information as never)) {
		return valueKind.getValue(input);
	}

	return input;
}
