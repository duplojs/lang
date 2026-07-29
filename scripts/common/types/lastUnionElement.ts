import type { UnionToIntersection } from "./unionToIntersection";

export type LastUnionElement<
	GenericUnion extends unknown,
> =
	UnionToIntersection<
		GenericUnion extends unknown
			? () => GenericUnion
			: never
	> extends () => infer InferredElement
		? InferredElement
		: never;
