type Primitive = (
	| string
	| boolean
	| null
	| number
	| undefined
	| bigint
);

export function to<
	GenericValue extends Primitive,
>(
	value: GenericValue,
): `${GenericValue}` {
	return `${value}`;
}
