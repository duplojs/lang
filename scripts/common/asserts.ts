import * as DKind from "@scripts/kind";
import { createKind } from "./kind";
import type { AnyFunction, AnyPredicate } from "./types";

export class AssertsError extends DKind.parentClass(
	createKind("asserts-error"),
	Error,
) {
	public constructor(
		public value: unknown,
	) {
		super(undefined, "Asserts Error.");
	}
}

export function asserts<
	GenericInput extends unknown,
	GenericPredicate extends GenericInput,
>(
	input: GenericInput,
	predicate: (input: GenericInput) => input is GenericPredicate,
): asserts input is GenericPredicate {
	if (!predicate(input)) {
		throw new AssertsError(input);
	}
}

export function forwardAsserts<
	GenericInput extends unknown,
	GenericPredicate extends GenericInput,
>(
	predicate: (input: GenericInput) => input is GenericPredicate,
): (input: GenericInput) => GenericPredicate;

export function forwardAsserts<
	GenericInput extends unknown,
>(
	predicate: (input: GenericInput) => boolean,
): (input: GenericInput) => GenericInput;

export function forwardAsserts<
	GenericInput extends unknown,
	GenericPredicate extends GenericInput,
>(
	input: GenericInput,
	predicate: (input: GenericInput) => input is GenericPredicate,
): GenericPredicate;

export function forwardAsserts<
	GenericInput extends unknown,
>(
	input: GenericInput,
	predicate: (input: GenericInput) => boolean,
): GenericInput;

export function forwardAsserts(
	...args:
		| [input: unknown, predicate: AnyPredicate | AnyFunction]
		| [predicate: AnyPredicate | AnyFunction]
) {
	if (args.length === 1) {
		const [predicate] = args;

		return (input: unknown) => forwardAsserts(input, predicate);
	}

	const [input, predicate] = args;

	if (!predicate(input)) {
		throw new AssertsError(input);
	}

	return input;
}
