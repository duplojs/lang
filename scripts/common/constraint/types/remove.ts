import type * as DObject from "@scripts/object";
import type * as DCommon from "@scripts/common";
import { type BaseConstraint } from "./base";

type RemoveConstraintByShape<
	GenericValue extends unknown,
	GenericSplitConstraint extends object = object,
> = DCommon.IsNever<GenericSplitConstraint> extends true
	? GenericValue
	: DCommon.LastUnionElement<GenericSplitConstraint> extends infer InferredSplitConstraint
		? GenericValue extends (
			& infer InferredValue
			& InferredSplitConstraint
		)
			? RemoveConstraintByShape<
				InferredValue,
				Exclude<GenericSplitConstraint, InferredSplitConstraint>
			>
			: GenericValue
		: never;

type LoopWhileHasConstraint<
	GenericValue extends unknown,
	GenericAccumulator extends readonly never[] = never,
> = 5 extends GenericAccumulator["length"]
	? GenericValue
	: GenericValue extends BaseConstraint
		? LoopWhileHasConstraint<
			RemoveConstraintByShape<
				GenericValue,
				Extract<DObject.Split<GenericValue, GenericAccumulator["length"]>, BaseConstraint>
			>,
			DCommon.IsNever<GenericAccumulator> extends true
				? [never]
				: [...GenericAccumulator, never]
		>
		: GenericValue;

export type RemoveConstraint<
	GenericValue extends unknown,
> = LoopWhileHasConstraint<GenericValue>;
