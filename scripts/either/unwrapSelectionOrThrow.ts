import * as DCommon from "@scripts/common";
import * as DKind from "@scripts/kind";
import type * as DObject from "@scripts/object";
import type { Left } from "./left";
import type { Right } from "./right";
import { createEitherKind, informationKind } from "./kind";

export class HasNotSelectedInformationError extends DKind.parentClass(
	createEitherKind("has-not-selected-information-error"),
	Error,
) {
	public constructor(
		public value: unknown,
		public selector: Record<string, boolean>,
	) {
		super(undefined, "Value information is not selected.");
	}
}

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

export function unwrapSelectionOrThrow<
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
>(
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
): (input: GenericInput) => DCommon.Unwrap<
	Extract<
		GenericInput,
		DKind.Kind<
			typeof informationKind,
			Extract<
				| DObject.GetPropsWithValue<GenericSelector, true>
				| DObject.GetPropsWithValue<GenericSelector, boolean>,
				string
			>
		>
	>
>;

export function unwrapSelectionOrThrow<
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
>(
	input: GenericInput,
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
): DCommon.Unwrap<
	Extract<
		GenericInput,
		DKind.Kind<
			typeof informationKind,
			Extract<
				| DObject.GetPropsWithValue<GenericSelector, true>
				| DObject.GetPropsWithValue<GenericSelector, boolean>,
				string
			>
		>
	>
>;

export function unwrapSelectionOrThrow(
	...args:
		| [input: unknown, selector: Record<string, boolean>]
		| [selector: Record<string, boolean>]
): any {
	if (args.length === 1) {
		const [selector] = args;

		return (input: unknown) => unwrapSelectionOrThrow(input, selector as never);
	}

	const [input, selector] = args;

	if (
		informationKind.has(input)
		&& selector[informationKind.getValue(input)] === true
	) {
		return DCommon.unwrap(input);
	}

	throw new HasNotSelectedInformationError(input, selector);
}
