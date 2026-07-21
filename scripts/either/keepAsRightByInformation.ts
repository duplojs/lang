import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { informationKind } from "./kind";
import { isLeft, left, type Left } from "./left";
import { isRight, right, type Right } from "./right";
import { hasInformation } from "./hasInformation";

type Either = Right | Left;

export function keepAsRightByInformation<
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
) => GenericInput extends Either
	? GenericInput extends DKind.Kind<typeof informationKind, GenericInformation>
		? GenericInput extends Right
			? GenericInput
			: Right<
				DKind.GetValue<typeof informationKind, GenericInput>,
				DCommon.Unwrap<GenericInput>
			>
		: Left<
			DKind.GetValue<typeof informationKind, GenericInput>,
			DCommon.Unwrap<GenericInput>
		>
	: GenericInput;

export function keepAsRightByInformation<
	GenericInput extends unknown,
	const GenericInformation extends (
		GenericInput extends Either
			? DKind.GetValue<typeof informationKind, GenericInput>
			: never
	),
>(
	input: GenericInput,
	information: GenericInformation | GenericInformation[],
): GenericInput extends Either
	? GenericInput extends DKind.Kind<typeof informationKind, GenericInformation>
		? GenericInput extends Right
			? GenericInput
			: Right<
				DKind.GetValue<typeof informationKind, GenericInput>,
				DCommon.Unwrap<GenericInput>
			>
		: Left<
			DKind.GetValue<typeof informationKind, GenericInput>,
			DCommon.Unwrap<GenericInput>
		>
	: GenericInput;

export function keepAsRightByInformation(
	...args:
		| [information: DCommon.MaybeArray<string>]
		| [input: unknown, information: DCommon.MaybeArray<string>]
): any {
	if (args.length === 1) {
		const [information] = args;

		return (input: unknown) => keepAsRightByInformation(
			input,
			information as never,
		);
	}

	const [input, information] = args;

	if (hasInformation(input, information as never)) {
		if (isLeft(input)) {
			return right(
				informationKind.getValue(input),
				DCommon.unwrap(input),
			);
		}

		return input;
	}

	if (isRight(input)) {
		return left(
			informationKind.getValue(input),
			DCommon.unwrap(input),
		);
	}

	return input;
}
