export declare const ConstraintSymbol: unique symbol;
export type ConstraintSymbol = typeof ConstraintSymbol;

export interface Constraint<
	GenericName extends string = string,
	GenericValue extends unknown = unknown,
> {
	[ConstraintSymbol]: {
		[Prop in GenericName]: GenericValue
	};
}

export interface DynamicConstraint<
	GenericName extends string = string,
	GenericValue extends string | number = never,
> extends Constraint<
		GenericName,
		Record<GenericValue, unknown>
	> {

}

export type RemoveConstraint<
	GenericValue extends unknown,
> = GenericValue extends (infer InferredValue) & Pick<
	GenericValue,
	Extract<ConstraintSymbol, keyof GenericValue>
>
	? InferredValue
	: GenericValue;

export type GetConstraint<
	GenericValue extends unknown,
> = GenericValue extends (infer InferredValue) & RemoveConstraint<GenericValue>
	? InferredValue
	: GenericValue;
