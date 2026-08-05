import type * as DObject from "@scripts/object";
import { type BaseConstraint } from "./base";
import { type IsNever, type IsEqual, type LastUnionElement } from "../../types";
import { type GetConstraint } from "./get";

type SeparateByComplexity<
	GenericConstraint extends BaseConstraint,
	GenericLevel extends number = never,
> = GenericConstraint extends any
	? DObject.Split<GenericConstraint, GenericLevel> extends infer InferredSplitConstraint
		? InferredSplitConstraint extends any
			? GenericConstraint extends (
					& (infer InferredSeparatedConstraints extends BaseConstraint)
					& InferredSplitConstraint
			)
				? GenericConstraint extends (
						& (infer InferredSeparatedCurrentConstraint extends BaseConstraint)
						& InferredSeparatedConstraints
				)
					? IsEqual<InferredSeparatedCurrentConstraint, BaseConstraint> extends true
						? [InferredSeparatedConstraints, "complex"]
						: [InferredSeparatedCurrentConstraint, "simple"]
					: never
				: never
			: never
		: never
	: never;

type RemoveSimpleFromComplex<
	GenericSimple extends BaseConstraint,
	GenericComplex extends BaseConstraint,
> = IsNever<GenericSimple> extends true
	? GenericComplex
	: LastUnionElement<GenericSimple> extends infer InferredLast extends BaseConstraint
		? GenericComplex extends (
			& (infer InferredRest extends BaseConstraint)
			& InferredLast
		)
			? RemoveSimpleFromComplex<
				Exclude<GenericSimple, InferredLast>,
				InferredRest
			>
			: never
		: never;

type LoopWhileHasComplex<
	GenericConstraint extends BaseConstraint,
	GenericAccumulator extends readonly never[] = never,
> = 5 extends GenericAccumulator["length"]
	? GenericConstraint
	: SeparateByComplexity<
		GenericConstraint,
		GenericAccumulator["length"]
	> extends infer InferredResult
		? [
			Extract<InferredResult, [BaseConstraint, "complex"]>,
			Extract<InferredResult, [BaseConstraint, "simple"]>,
		] extends [
			infer InferredComplexResult extends [BaseConstraint, "complex"],
			infer InferredSimpleResult extends [BaseConstraint, "simple"],
		]
			? IsNever<InferredComplexResult> extends true
				? InferredSimpleResult[0]
				: (
					| LoopWhileHasComplex<
						RemoveSimpleFromComplex<
							InferredSimpleResult[0],
							InferredComplexResult[0]
						>,
						IsNever<GenericAccumulator> extends true
							? [never]
							: [...GenericAccumulator, never]
					>
					| InferredSimpleResult[0]
				)
			: never
		: never;

export type UnbundlesConstraint<
	GenericConstraint extends BaseConstraint,
> = LoopWhileHasComplex<
	GetConstraint<GenericConstraint>
>;

