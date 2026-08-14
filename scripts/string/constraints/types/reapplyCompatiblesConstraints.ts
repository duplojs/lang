import type * as DCommon from "@scripts/common";
import type { IsLiteral } from "../../types";
import type { ExtractLengthEqual, LengthEqual } from "../lengthEqual";
import type { ExtractMaxCharacters, MaxCharacters } from "../maxCharacters";
import type { ExtractMinCharacters, MinCharacters } from "../minCharacters";

type ApplyLengthEqual<
	GenericOutput extends string,
	GenericSource extends string,
	GenericReapplyConstraint extends "maxCharacters" | "minCharacters" | "lengthEqual",
> = "lengthEqual" extends GenericReapplyConstraint
	? (
		ExtractLengthEqual<GenericSource, unknown> extends LengthEqual<infer InferredLength>
			? (
				& GenericOutput
				& DCommon.UnionToIntersection<
					InferredLength extends number
						? LengthEqual<InferredLength>
						: never
				>
			)
			: GenericOutput
	)
	: GenericOutput;

type ApplyMinCharacters<
	GenericOutput extends string,
	GenericSource extends string,
	GenericReapplyConstraint extends "maxCharacters" | "minCharacters" | "lengthEqual",
> = "minCharacters" extends GenericReapplyConstraint
	? (
		ExtractMinCharacters<GenericSource, unknown> extends MinCharacters<infer InferredMin>
			? (
				& GenericOutput
				& DCommon.UnionToIntersection<
					InferredMin extends number
						? MinCharacters<InferredMin>
						: never
				>
			)
			: GenericOutput
	)
	: GenericOutput;

type ApplyMaxCharacters<
	GenericOutput extends string,
	GenericSource extends string,
	GenericReapplyConstraint extends "maxCharacters" | "minCharacters" | "lengthEqual",
> = "maxCharacters" extends GenericReapplyConstraint
	? ExtractMaxCharacters<GenericSource, unknown> extends MaxCharacters<infer InferredMax>
		? (
			& GenericOutput
			& DCommon.UnionToIntersection<
				InferredMax extends number
					? MaxCharacters<InferredMax>
					: never
			>
		)
		: GenericOutput
	: GenericOutput;

export type ReapplyCompatiblesConstraints<
	GenericSource extends string,
	GenericOutput extends string,
	GenericReapplyConstraint extends "maxCharacters" | "minCharacters" | "lengthEqual" = "maxCharacters" | "minCharacters" | "lengthEqual",
> = IsLiteral<Extract<DCommon.RemoveConstraint<GenericSource>, string>> extends true
	? GenericOutput
	: ApplyMaxCharacters<
		ApplyMinCharacters<
			ApplyLengthEqual<
				GenericOutput,
				GenericSource,
				GenericReapplyConstraint
			>,
			GenericSource,
			GenericReapplyConstraint
		>,
		GenericSource,
		GenericReapplyConstraint
	>;
