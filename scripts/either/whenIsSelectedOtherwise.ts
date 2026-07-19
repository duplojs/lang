import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type * as DObject from "@scripts/object";
import { informationKind } from "./kind";
import type { Left } from "./left";
import type { Right } from "./right";

type Either = Right | Left;

type ForbiddenMoreKey<
	GenericInput extends unknown,
	GenericSelector extends Record<string, boolean>,
> = DObject.ForbiddenKey<
	GenericSelector,
	Extract<
		Exclude<
			keyof GenericSelector,
			DKind.GetValue<typeof informationKind, Extract<GenericInput, Either>>
		>,
		string
	>
>;

type SelectedKind<
	GenericSelector extends Record<string, boolean>,
> = DKind.Kind<
	typeof informationKind,
	Extract<DObject.GetPropsWithValue<GenericSelector, true>, string>
>;

type CallbackSelectedKind<
	GenericSelector extends Record<string, boolean>,
> = DKind.Kind<
	typeof informationKind,
	Extract<
		(
			| DObject.GetPropsWithValue<GenericSelector, true>
			| DObject.GetPropsWithValue<GenericSelector, boolean>
		),
		string
	>
>;

export function whenIsSelectedOtherwise<
	GenericInput extends unknown,
	const GenericSelector extends Record<
		DKind.GetValue<typeof informationKind, Extract<GenericInput, Either>>,
		boolean
	>,
	const GenericOutput extends unknown,
	const GenericOtherwiseOutput extends unknown,
>(
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
	theFunction: (
		value: DCommon.Unwrap<Extract<GenericInput, CallbackSelectedKind<GenericSelector>>>,
	) => GenericOutput,
	otherwiseFunction: (
		value: Exclude<GenericInput, SelectedKind<GenericSelector>>,
	) => GenericOtherwiseOutput,
): (input: GenericInput) => GenericOutput | GenericOtherwiseOutput;

export function whenIsSelectedOtherwise<
	GenericInput extends unknown,
	const GenericSelector extends Record<
		DKind.GetValue<typeof informationKind, Extract<GenericInput, Either>>,
		boolean
	>,
	const GenericOutput extends unknown,
	const GenericOtherwiseOutput extends unknown,
>(
	input: GenericInput,
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
	theFunction: (
		value: DCommon.Unwrap<Extract<GenericInput, CallbackSelectedKind<GenericSelector>>>,
	) => GenericOutput,
	otherwiseFunction: (
		value: Exclude<GenericInput, SelectedKind<GenericSelector>>,
	) => GenericOtherwiseOutput,
): GenericOutput | GenericOtherwiseOutput;

export function whenIsSelectedOtherwise(
	...args:
		| [
			input: unknown,
			selector: Record<string, boolean>,
			theFunction: DCommon.AnyFunction,
			otherwiseFunction: DCommon.AnyFunction,
		]
		| [
			selector: Record<string, boolean>,
			theFunction: DCommon.AnyFunction,
			otherwiseFunction: DCommon.AnyFunction,
		]
): any {
	if (args.length === 3) {
		const [selector, theFunction, otherwiseFunction] = args;

		return (input: unknown) => whenIsSelectedOtherwise(
			input,
			selector as never,
			theFunction,
			otherwiseFunction,
		);
	}

	const [input, selector, theFunction, otherwiseFunction] = args;

	if (
		informationKind.has(input)
		&& selector[informationKind.getValue(input)] === true
	) {
		return theFunction(DCommon.unwrap(input));
	}

	return otherwiseFunction(input);
}
