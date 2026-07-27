import type * as DCommon from "@scripts/common";
import type { LengthEqual } from "../lengthEqual";
import type { MaxCharacters } from "../maxCharacters";
import type { MinCharacters } from "../minCharacters";

type ApplyLengthEqual<
	GenericOutput extends string,
	GenericSource extends string,
> = GenericSource extends LengthEqual<infer InferredLength>
	? GenericOutput & LengthEqual<InferredLength>
	: GenericOutput;

type ApplyMinCharacters<
	GenericOutput extends string,
	GenericSource extends string,
> = GenericSource extends MinCharacters<infer InferredMin>
	? GenericOutput & MinCharacters<InferredMin>
	: GenericOutput;

type ApplyMaxCharacters<
	GenericOutput extends string,
	GenericSource extends string,
> = GenericSource extends MaxCharacters<infer InferredMax>
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

