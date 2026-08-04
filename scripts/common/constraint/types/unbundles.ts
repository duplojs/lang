import type * as DObject from "@scripts/object";
import { type Constraint } from "./base";
import { type IsNever, type IsEqual, type LastUnionElement } from "../../types";

type SeparateByComplexity<
	GenericConstraint extends Constraint,
	GenericLevel extends number = never,
> = GenericConstraint extends any
	? DObject.Split<GenericConstraint, GenericLevel> extends infer InferredSplitConstraint
		? InferredSplitConstraint extends any
			? GenericConstraint extends (
					& (infer InferredSeparatedConstraints extends Constraint)
					& InferredSplitConstraint
			)
				? GenericConstraint extends (
						& (infer InferredSeparatedCurrentConstraint extends Constraint)
						& InferredSeparatedConstraints
				)
					? IsEqual<InferredSeparatedCurrentConstraint, Constraint> extends true
						? [InferredSeparatedConstraints, "complex"]
						: [InferredSeparatedCurrentConstraint, "simple"]
					: never
				: never
			: never
		: never
	: never;

type RemoveSimpleFromComplex<
	GenericSimple extends Constraint,
	GenericComplex extends Constraint,
> = IsNever<GenericSimple> extends true
	? GenericComplex
	: LastUnionElement<GenericSimple> extends infer InferredLast extends Constraint
		? GenericComplex extends (
			& (infer InferredRest extends Constraint)
			& InferredLast
		)
			? RemoveSimpleFromComplex<
				Exclude<GenericSimple, InferredLast>,
				InferredRest
			>
			: never
		: never;

type LoopWhileHasComplex<
	GenericConstraint extends Constraint,
	GenericAccumulator extends readonly never[] = never,
> = 5 extends GenericAccumulator["length"]
	? GenericConstraint
	: SeparateByComplexity<
		GenericConstraint,
		GenericAccumulator["length"]
	> extends infer InferredResult
		? [
			Extract<InferredResult, [Constraint, "complex"]>,
			Extract<InferredResult, [Constraint, "simple"]>,
		] extends [
			infer InferredComplexResult extends [Constraint, "complex"],
			infer InferredSimpleResult extends [Constraint, "simple"],
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
							? [never, never]
							: [...GenericAccumulator, never]
					>
					| InferredSimpleResult[0]
				)
			: never
		: never;

export type UnbundlesConstraint<
	GenericConstraint extends Constraint,
> = LoopWhileHasComplex<GenericConstraint>;

