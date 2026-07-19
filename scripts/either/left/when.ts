import * as DCommon from "@scripts/common";
import type { Left } from "./create";
import { isLeft } from "./is";

export function whenIsLeft<
	const GenericInput extends unknown,
	const GenericOutput extends DCommon.AnyValue | DCommon.EscapeVoid,
>(
	theFunction: (
		eitherValue: DCommon.Unwrap<
			Extract<
				DCommon.BreakGenericLink<GenericInput>,
				Left
			>
		>,
	) => GenericOutput,
): (input: GenericInput) => (
	| Exclude<
		DCommon.BreakGenericLink<GenericInput>,
		Left
	>
	| GenericOutput
);

export function whenIsLeft<
	const GenericInput extends unknown,
	const GenericOutput extends DCommon.AnyValue | DCommon.EscapeVoid,
>(
	input: GenericInput,
	theFunction: (
		eitherValue: DCommon.Unwrap<
			Extract<
				DCommon.BreakGenericLink<GenericInput>,
				Left
			>
		>,
	) => GenericOutput,
): (
	| Exclude<GenericInput, Left>
	| GenericOutput
);

export function whenIsLeft(
	...args:
		| [input: unknown, theFunction: DCommon.AnyFunction]
		| [theFunction: DCommon.AnyFunction]
): any {
	if (args.length === 1) {
		const [theFunction] = args;

		return (input: unknown) => whenIsLeft(
			input,
			theFunction,
		);
	}

	const [input, theFunction] = args;

	if (isLeft(input)) {
		return theFunction(DCommon.unwrap(input));
	}

	return input;
}
