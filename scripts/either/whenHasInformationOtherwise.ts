import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type { Left } from "./left";
import type { Right } from "./right";
import { informationKind } from "./kind";

type Either = Right | Left;

/**
 * {@include either/whenHasInformationOtherwise/index.md}
 */
export function whenHasInformationOtherwise<
	const GenericInput extends unknown,
	GenericInformation extends(
		GenericInput extends Either
			? DKind.GetValue<typeof informationKind, Extract<GenericInput, Either>>
			: never
	),
	const GenericOutput extends unknown,
	const GenericOtherwiseOutput extends unknown,
>(
	information: GenericInformation | readonly GenericInformation[],
	theFunction: (
		value: DCommon.Unwrap<
			Extract<
				DCommon.BreakGenericLink<GenericInput>,
				(
					& DKind.Kind<typeof informationKind, GenericInformation>
					& DCommon.WrappedValue
				)
			>
		>,
	) => GenericOutput,
	otherwiseFunction: (
		value: Exclude<
			DCommon.BreakGenericLink<GenericInput>,
			DKind.Kind<typeof informationKind, GenericInformation>
		>,
	) => GenericOtherwiseOutput,
): (input: GenericInput) => GenericOutput | GenericOtherwiseOutput;

export function whenHasInformationOtherwise<
	const GenericInput extends unknown,
	GenericInformation extends(
		GenericInput extends Either
			? DKind.GetValue<typeof informationKind, Extract<GenericInput, Either>>
			: never
	),
	const GenericOutput extends unknown,
	const GenericOtherwiseOutput extends unknown,
>(
	input: GenericInput,
	information: GenericInformation | readonly GenericInformation[],
	theFunction: (
		value: DCommon.Unwrap<
			Extract<
				DCommon.BreakGenericLink<GenericInput>,
				(
					& DKind.Kind<typeof informationKind, GenericInformation>
					& DCommon.WrappedValue
				)
			>
		>,
	) => GenericOutput,
	otherwiseFunction: (
		value: Exclude<
			DCommon.BreakGenericLink<GenericInput>,
			DKind.Kind<typeof informationKind, GenericInformation>
		>,
	) => GenericOtherwiseOutput,
): GenericOutput | GenericOtherwiseOutput;

export function whenHasInformationOtherwise(
	...args:
		| [
			input: unknown,
			information: string | readonly string[],
			theFunction: DCommon.AnyFunction,
			otherwiseFunction: DCommon.AnyFunction,
		]
		| [
			information: string | readonly string[],
			theFunction: DCommon.AnyFunction,
			otherwiseFunction: DCommon.AnyFunction,
		]
): any {
	if (args.length === 3) {
		const [information, theFunction, otherwiseFunction] = args;

		return (input: unknown) => whenHasInformationOtherwise(
			input,
			information as never,
			theFunction,
			otherwiseFunction,
		);
	}

	const [input, information, theFunction, otherwiseFunction] = args;
	const formattedInformation = information instanceof Array
		? information
		: [information];

	if (
		informationKind.has(input)
		&& formattedInformation.includes(informationKind.getValue(input))
	) {
		return theFunction(DCommon.unwrap(input));
	}

	return otherwiseFunction(input);
}
