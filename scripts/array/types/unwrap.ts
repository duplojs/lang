export type Unwrap<
	GenericValue extends unknown,
> = GenericValue extends readonly any[]
	? GenericValue[number]
	: GenericValue;
