import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import * as DObject from "@scripts/object";
import { push } from "./push";
import { createKind } from "./kind";

export interface ArrayReduceNext<
	GenericOutput extends unknown = unknown,
> {
	"-next": GenericOutput;
}

export interface ArrayReduceExit<
	GenericOutput extends unknown = unknown,
> {
	"-exit": GenericOutput;
}

export interface ArrayReduceFunctionParams<
	GenericInputArray extends readonly unknown[] = unknown[],
	GenericOutput extends unknown = unknown,
> {
	element: GenericInputArray[number];
	index: number;
	lastValue: GenericOutput;
	nextWithObject: GenericOutput extends object
		? (
			object1: GenericOutput,
			object2: Partial<GenericOutput>,
		) => ArrayReduceNext<GenericOutput>
		: undefined;
	next(output: GenericOutput): ArrayReduceNext<GenericOutput>;
	exit<
		GenericExitValue extends unknown,
	>(output: GenericExitValue): ArrayReduceExit<GenericExitValue>;
	self: GenericInputArray;
	nextPush: GenericOutput extends readonly any[]
		? (
			array: GenericOutput,
			...values: GenericOutput
		) => ArrayReduceNext<GenericOutput>
		: undefined;
}

const reduceFromKind = createKind(
	"reduce-from",
);

export interface ArrayReduceFromResult<
	GenericValue extends unknown = unknown,
> extends DKind.Kind<typeof reduceFromKind, GenericValue> {}

export function reduceFrom<
	GenericValue extends unknown,
>(value: GenericValue): ArrayReduceFromResult<GenericValue> {
	return {
		[reduceFromKind.runTimeKey]: value,
	} as never;
}

export const reduceTools: Pick<
	ArrayReduceFunctionParams<any, any>,
	"exit" | "next" | "nextWithObject" | "nextPush"
> = {
	exit(output: any) {
		return { "-exit": output };
	},
	next(output: any) {
		return { "-next": output };
	},
	nextWithObject(object1: object, object2: object) {
		return { "-next": DObject.override(object1, object2) };
	},
	nextPush(
		array: readonly unknown[],
		...[value, ...values]: [unknown, ...unknown[]]
	) {
		return { "-next": push(array, value, ...values) };
	},
};

export type ArrayEligibleReduceFromValue = number | string | bigint | boolean | ArrayReduceFromResult;

export type ArrayReduceFromValue<
	GenericValue extends ArrayEligibleReduceFromValue,
> = GenericValue extends ArrayReduceFromResult<infer InferredValue>
	? InferredValue
	: DCommon.ToLargeEnsemble<GenericValue>;

export function reduce<
	GenericArray extends readonly unknown[],
	GenericReduceFrom extends ArrayEligibleReduceFromValue,
	GenericExit extends ArrayReduceExit = ArrayReduceExit<never>,
>(
	fromValue: GenericReduceFrom,
	theFunction: (
		params: ArrayReduceFunctionParams<
			GenericArray,
			ArrayReduceFromValue<GenericReduceFrom>
		>,
	) => ArrayReduceNext<ArrayReduceFromValue<GenericReduceFrom>> | GenericExit,
): (
	array: GenericArray,
) => ArrayReduceFromValue<GenericReduceFrom> | (
	DCommon.IsEqual<GenericExit, ArrayReduceExit> extends true
		? never
		: GenericExit["-exit"]
);

export function reduce<
	GenericArray extends readonly unknown[],
	GenericReduceFrom extends number | string | bigint | boolean | ArrayReduceFromResult,
	GenericExit extends ArrayReduceExit = ArrayReduceExit<never>,
>(
	array: GenericArray,
	fromValue: GenericReduceFrom,
	theFunction: (
		params: ArrayReduceFunctionParams<
			GenericArray,
			ArrayReduceFromValue<GenericReduceFrom>
		>,
	) => ArrayReduceNext<ArrayReduceFromValue<GenericReduceFrom>> | GenericExit,
): ArrayReduceFromValue<GenericReduceFrom> | (
	DCommon.IsEqual<GenericExit, ArrayReduceExit> extends true
		? never
		: GenericExit["-exit"]
);

export function reduce(
	...args:
		| [fromValue: unknown, theFunction: DCommon.AnyFunction]
		| [array: readonly unknown[], fromValue: unknown, theFunction: DCommon.AnyFunction]
): any {
	if (args.length === 2) {
		const [fromValue, theFunction] = args;

		return (array: readonly unknown[]) => reduce(
			array,
			fromValue as never,
			theFunction as never,
		);
	}

	const [array, fromValue, theFunction] = args;

	let lastValue = reduceFromKind.has(fromValue)
		? reduceFromKind.getValue(fromValue)
		: fromValue;

	for (let index = 0; index < array.length; index++) {
		const element = array[index]!;

		const result = theFunction({
			element,
			index,
			lastValue,
			self: array,
			...reduceTools,
		}) as ArrayReduceExit | ArrayReduceNext;

		if ("-exit" in result) {
			return result["-exit"];
		}

		lastValue = result["-next"];
	}

	return lastValue;
}
