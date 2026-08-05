import { type RemoveConstraint } from "./remove";

export type GetConstraint<
	GenericValue extends unknown,
> = GenericValue extends (
		& (infer InferredValue)
		& RemoveConstraint<GenericValue>
)
	? InferredValue
	: GenericValue;
