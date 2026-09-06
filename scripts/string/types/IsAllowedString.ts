type IsAllowedTail<
	GenericValue extends string,
	GenericAllowed extends string,
> =
	GenericValue extends `${infer Char}${infer Rest}`
		? Char extends GenericAllowed
			? IsAllowedTail<Rest, GenericAllowed>
			: false
		: true;

export type IsAllowedString<
	GenericValue extends string,
	GenericAllowed extends string,
> =
	GenericValue extends `${infer InferredA}${infer InferredB}${infer InferredC}${infer InferredD}${infer InferredE}${infer InferredF}${infer InferredG}${infer InferredH}${infer InferredRest}`
		? (
			| InferredA
			| InferredB
			| InferredC
			| InferredD
			| InferredE
			| InferredF
			| InferredG
			| InferredH
		) extends GenericAllowed
			? IsAllowedString<InferredRest, GenericAllowed>
			: false
		: IsAllowedTail<GenericValue, GenericAllowed>;
