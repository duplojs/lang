import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type * as DObject from "@scripts/object";
import type { Left } from "./left";
import type { Right } from "./right";
import { informationKind } from "./kind";

type Either = Right | Left;

type ForbiddenMoreKey<
	GenericInput extends unknown,
	GenericSelector extends Record<string, boolean>,
> = DObject.ForbiddenKey<
	GenericSelector,
	Extract<
		Exclude<
			keyof GenericSelector,
			DKind.GetValue<
				typeof informationKind,
				Extract<GenericInput, Either>
			>
		>,
		string
	>
>;

export function whenIsSelected<
	GenericInput extends unknown,
	const GenericSelector extends Record<
		DKind.GetValue<
			typeof informationKind,
			Extract<
				GenericInput,
				Either
			>
		>,
		boolean
	>,
	const GenericOutput extends unknown,
>(
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
	theFunction: (
		value: DCommon.Unwrap<
			Extract<
				GenericInput,
				DKind.Kind<
					typeof informationKind,
					Extract<
						(
							| DObject.GetPropsWithValue<GenericSelector, true>
							| DObject.GetPropsWithValue<GenericSelector, boolean>
						),
						string
					>
				>
			>
		>,
	) => GenericOutput,
): (input: GenericInput) => (
	| GenericOutput
	| Exclude<
		GenericInput,
		DKind.Kind<
			typeof informationKind,
			Extract<
				DObject.GetPropsWithValue<GenericSelector, true>,
				string
			>
		>
	>
);

export function whenIsSelected<
	GenericInput extends unknown,
	const GenericSelector extends Record<
		DKind.GetValue<
			typeof informationKind,
			Extract<
				GenericInput,
				Either
			>
		>,
		boolean
	>,
	const GenericOutput extends unknown,
>(
	input: GenericInput,
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
	theFunction: (
		value: DCommon.Unwrap<
			Extract<
				GenericInput,
				DKind.Kind<
					typeof informationKind,
					Extract<
						(
							| DObject.GetPropsWithValue<GenericSelector, true>
							| DObject.GetPropsWithValue<GenericSelector, boolean>
						),
						string
					>
				>
			>
		>,
	) => GenericOutput,
): (
	| GenericOutput
	| Exclude<
		GenericInput,
		DKind.Kind<
			typeof informationKind,
			Extract<
				DObject.GetPropsWithValue<GenericSelector, true>,
				string
			>
		>
	>
);

export function whenIsSelected(
	...args:
		| [
			input: unknown,
			selector: Record<string, boolean>,
			theFunction: DCommon.AnyFunction,
		]
		| [
			selector: Record<string, boolean>,
			theFunction: DCommon.AnyFunction,
		]
): any {
	if (args.length === 2) {
		const [selector, theFunction] = args;

		return (input: unknown) => whenIsSelected(
			input,
			selector as never,
			theFunction,
		);
	}

	const [input, selector, theFunction] = args;

	if (
		informationKind.has(input)
		&& selector[informationKind.getValue(input)] === true
	) {
		return theFunction(DCommon.unwrap(input));
	}

	return input;
}
