import { type ConstraintSymbol } from "./base";

export type RemoveConstraint<
	GenericValue extends unknown,
> = GenericValue extends (infer InferredValue) & Pick<
	GenericValue,
	Extract<ConstraintSymbol, keyof GenericValue>
>
	? InferredValue
	: GenericValue;
