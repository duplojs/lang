import type * as DCommon from "@scripts/common";
import type { ExtractLengthEqual, LengthEqual } from "../lengthEqual";
import type { ExtractMaxCharacters, MaxCharacters } from "../maxCharacters";
import type { ExtractMinCharacters, MinCharacters } from "../minCharacters";

type ApplyLengthEqual<
	GenericOutput extends string,
	GenericSource extends string,
> = ExtractLengthEqual<
	GenericSource,
	unknown
> extends LengthEqual<infer InferredLength>
	? GenericOutput & LengthEqual<InferredLength>
	: GenericOutput;

type ApplyMinCharacters<
	GenericOutput extends string,
	GenericSource extends string,
> = ExtractMinCharacters<
	GenericSource,
	unknown
> extends MinCharacters<infer InferredMin>
	? GenericOutput & MinCharacters<InferredMin>
	: GenericOutput;

type ApplyMaxCharacters<
	GenericOutput extends string,
	GenericSource extends string,
> = ExtractMaxCharacters<
	GenericSource,
	unknown
> extends MaxCharacters<infer InferredMax>
	? GenericOutput & MaxCharacters<InferredMax>
	: GenericOutput;

export type ReapplyAllSizeConstraints<
	GenericSource extends string,
	GenericOutput extends string,
	GenericExpectConstraint extends "maxCharacters" | "minCharacters" | "lengthEqual" = never,
> = DCommon.IsNever<GenericExpectConstraint> extends true
	? ApplyMaxCharacters<
		ApplyMinCharacters<
			ApplyLengthEqual<GenericOutput, GenericSource>,
			GenericSource
		>,
		GenericSource
	>
	: (
		"lengthEqual" extends GenericExpectConstraint
			? GenericOutput
			: ApplyLengthEqual<GenericOutput, GenericSource>
	) extends infer InferredOutput extends string
		? (
			"minCharacters" extends GenericExpectConstraint
				? InferredOutput
				: ApplyMinCharacters<InferredOutput, GenericSource>
		) extends infer InferredOutput extends string
			? "maxCharacters" extends GenericExpectConstraint
				? InferredOutput
				: ApplyMaxCharacters<InferredOutput, GenericSource>
			: never
		: never;

