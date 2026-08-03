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
