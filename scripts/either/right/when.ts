import * as DCommon from "@scripts/common";
import type { Right } from "./create";
import { isRight } from "./is";

/**
 * {@include either/whenIsRight/index.md}
 */
export function whenIsRight<
	const GenericInput extends unknown,
	const GenericOutput extends DCommon.AnyValue | DCommon.EscapeVoid,
>(
	theFunction: (
		eitherValue: DCommon.Unwrap<
			Extract<
				DCommon.BreakGenericLink<GenericInput>,
				Right
			>
		>,
	) => GenericOutput,
): (input: GenericInput) => (
	| Exclude<
		DCommon.BreakGenericLink<GenericInput>,
		Right
	>
	| GenericOutput
);

export function whenIsRight<
	const GenericInput extends unknown,
	const GenericOutput extends DCommon.AnyValue | DCommon.EscapeVoid,
>(
	input: GenericInput,
	theFunction: (
		eitherValue: DCommon.Unwrap<
			Extract<
				DCommon.BreakGenericLink<GenericInput>,
				Right
			>
		>,
	) => GenericOutput,
): (
	| Exclude<GenericInput, Right>
	| GenericOutput
);

export function whenIsRight(
	...args:
		| [input: unknown, theFunction: DCommon.AnyFunction]
		| [theFunction: DCommon.AnyFunction]
) {
	if (args.length === 1) {
		const [theFunction] = args;

		return (input: unknown) => whenIsRight(
			input,
			theFunction,
		);
	}

	const [input, theFunction] = args;

	if (isRight(input)) {
		return theFunction(DCommon.unwrap(input));
	}

	return input;
}
