export function length<
	GenericArray extends readonly unknown[],
>(array: GenericArray): GenericArray["length"] {
	return array.length;
}
