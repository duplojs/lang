import * as DCommon from "@scripts/common";
import type { Right } from "../right";
import { isLeft } from "./is";
import type { Left } from "./create";

type Either = Right | Left;

export function whenIsLeftOtherwise<
	const GenericInput extends unknown,
	const GenericOutput1 extends DCommon.AnyValue | DCommon.EscapeVoid,
	const GenericOutput2 extends DCommon.AnyValue | DCommon.EscapeVoid,
>(
	theFunction: (
		value: DCommon.Unwrap<
			Extract<
				DCommon.BreakGenericLink<GenericInput>,
				Left
			>
		>,
	) => GenericOutput1,
	otherwiseFunction: (
		value: (
			| Extract<
				DCommon.BreakGenericLink<GenericInput>,
				Right
			>
			| Exclude<GenericInput, Either>
		),
	) => GenericOutput2,
): (input: GenericInput) => (
	| DCommon.BreakGenericLink<GenericOutput1>
	| DCommon.BreakGenericLink<GenericOutput2>
);

export function whenIsLeftOtherwise<
	const GenericInput extends unknown,
	const GenericOutput1 extends DCommon.AnyValue | DCommon.EscapeVoid,
	const GenericOutput2 extends DCommon.AnyValue | DCommon.EscapeVoid,
>(
	input: GenericInput,
	theFunction: (
		value: DCommon.Unwrap<
			Extract<
				DCommon.BreakGenericLink<GenericInput>,
				Left
			>
		>,
	) => GenericOutput1,
	otherwiseFunction: (
		value: (
			| Extract<
				DCommon.BreakGenericLink<GenericInput>,
				Right
			>
			| Exclude<GenericInput, Either>
		),
	) => GenericOutput2,
): (
	| DCommon.BreakGenericLink<GenericOutput1>
	| DCommon.BreakGenericLink<GenericOutput2>
);

export function whenIsLeftOtherwise(
	...args:
		| [
			input: unknown,
			theFunction: DCommon.AnyFunction,
			otherwiseFunction: DCommon.AnyFunction,
		]
		| [
			theFunction: DCommon.AnyFunction,
			otherwiseFunction: DCommon.AnyFunction,
		]
) {
	if (args.length === 2) {
		const [theFunction, otherwiseFunction] = args;

		return (input: unknown) => whenIsLeftOtherwise(
			input,
			theFunction,
			otherwiseFunction,
		);
	}

	const [input, theFunction, otherwiseFunction] = args;

	if (isLeft(input)) {
		return theFunction(DCommon.unwrap(input));
	}

	return otherwiseFunction(input);
}
