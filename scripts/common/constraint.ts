declare const ConstraintKind: unique symbol;
export type ConstraintKind = typeof ConstraintKind;

export interface Constraint<
	ConstraintName extends string = string,
> {
	[ConstraintKind]: {
		[Prop in ConstraintName]: unknown
	};
}

export type RemoveConstraint<
	GenericValue extends unknown,
> = GenericValue extends (infer InferredValue) & Pick<
	GenericValue,
	Extract<ConstraintKind, keyof GenericValue>
>
	? InferredValue
	: GenericValue;
