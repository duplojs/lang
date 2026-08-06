import type { AllowedCharacters, CharactersRange } from "../allowedCharacters";

export type ReapplyAllowedCharacters<
	GenericSource extends string,
	GenericOutput extends string,
> = GenericSource extends AllowedCharacters<infer InferredCharactersRange extends CharactersRange>
	? GenericOutput & AllowedCharacters<InferredCharactersRange>
	: GenericOutput;
