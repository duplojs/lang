import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { isRight, type Right } from "./right";
import { isLeft, type Left } from "./left";
import { informationKind } from "./kind";

type Either = Right | Left;

/**
 * {@include either/whenHasInformation/index.md}
 */
export function whenHasInformation<
	const GenericInput extends unknown,
	GenericInformation extends(
		GenericInput extends Either
			? DKind.GetValue<typeof informationKind, Extract<GenericInput, Either>>
			: never
	),
	const GenericOutput extends unknown,
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
): (input: GenericInput) => (
	| GenericOutput
	| Exclude<
		DCommon.BreakGenericLink<GenericInput>,
		DKind.Kind<typeof informationKind, GenericInformation>
	>
);

export function whenHasInformation<
	const GenericInput extends unknown,
	GenericInformation extends(
		GenericInput extends Either
			? DKind.GetValue<typeof informationKind, Extract<GenericInput, Either>>
			: never
	),
	const GenericOutput extends unknown,
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
): (
	| GenericOutput
	| Exclude<
		DCommon.BreakGenericLink<GenericInput>,
		DKind.Kind<typeof informationKind, GenericInformation>
	>
);

export function whenHasInformation(
	...args:
		| [
			input: unknown,
			information: string | readonly string[],
			theFunction: DCommon.AnyFunction,
		]
		| [
			information: string | readonly string[],
			theFunction: DCommon.AnyFunction,
		]
): any {
	if (args.length === 2) {
		const [information, theFunction] = args;

		return (input: unknown) => whenHasInformation(
			input,
			information as never,
			theFunction,
		);
	}

	const [input, information, theFunction] = args;

	const formattedInformation = information instanceof Array
		? information
		: [information];

	if (
		(
			isLeft(input)
			|| isRight(input)
		) && formattedInformation.includes(
			informationKind.getValue(input),
		)
	) {
		return theFunction(DCommon.unwrap(input));
	}

	return input;
}
