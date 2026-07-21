import * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import type { Left } from "./left";
import type { Right } from "./right";
import { createKind, type informationKind } from "./kind";
import { hasInformation } from "./hasInformation";

export class HasNotInformationError extends DKind.parentClass(
	createKind("has-not-information-error"),
	Error,
) {
	public constructor(
		public value: unknown,
		public information: DCommon.MaybeArray<string>,
	) {
		const formattedInformation = information instanceof Array
			? information.join(" or ")
			: information;

		super(undefined, `Value has not information "${formattedInformation}".`);
	}
}

type Either = Right | Left;

export function unwrapByInformationOrThrow<
	GenericInput extends unknown,
	const GenericInformation extends (
		GenericInput extends Either
			? DKind.GetValue<typeof informationKind, GenericInput>
			: never
	),
>(
	information: GenericInformation | GenericInformation[],
): (
	input: GenericInput,
) => DCommon.Unwrap<
	Extract<
		GenericInput,
		DKind.Kind<typeof informationKind, GenericInformation>
	>
>;

export function unwrapByInformationOrThrow<
	GenericInput extends unknown,
	GenericInformation extends(
		GenericInput extends Either
			? DKind.GetValue<typeof informationKind, GenericInput>
			: never
	),
>(
	input: GenericInput,
	information: GenericInformation | GenericInformation[],
): DCommon.Unwrap<
	Extract<
		GenericInput,
		DKind.Kind<typeof informationKind, GenericInformation>
	>
>;

export function unwrapByInformationOrThrow(
	...args:
		| [DCommon.MaybeArray<string>]
		| [unknown, DCommon.MaybeArray<string>]
): any {
	if (args.length === 1) {
		const [information] = args;

		return (input: unknown) => unwrapByInformationOrThrow(
			input,
			information as never,
		);
	}

	const [input, information] = args;

	if (hasInformation(input, information as never)) {
		return DCommon.unwrap(input);
	}

	throw new HasNotInformationError(input, information);
}
