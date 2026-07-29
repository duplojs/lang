import type * as DCommon from "@scripts/common";
import type { LengthEqual } from "../lengthEqual";
import type { MaxElements } from "../maxElements";
import type { MinElements } from "../minElements";

type ApplyLengthEqual<
	GenericOutput extends readonly unknown[],
	GenericSource extends readonly unknown[],
> = GenericSource extends LengthEqual<infer InferredLength>
	? GenericOutput & LengthEqual<InferredLength>
	: GenericOutput;

type ApplyMinElements<
	GenericOutput extends readonly unknown[],
	GenericSource extends readonly unknown[],
> = GenericSource extends MinElements<infer InferredMin>
	? GenericOutput & MinElements<InferredMin>
	: GenericOutput;

type ApplyMaxElements<
	GenericOutput extends readonly unknown[],
	GenericSource extends readonly unknown[],
> = GenericSource extends MaxElements<infer InferredMax>
	? GenericOutput & MaxElements<InferredMax>
	: GenericOutput;

export type ReapplyAllSizeConstraints<
	GenericSource extends readonly unknown[],
	GenericOutput extends readonly unknown[],
	GenericExpectConstraint extends "maxElements" | "minElements" | "lengthEqual" = never,
> = DCommon.IsNever<GenericExpectConstraint> extends true
	? ApplyMaxElements<
		ApplyMinElements<
			ApplyLengthEqual<GenericOutput, GenericSource>,
			GenericSource
		>,
		GenericSource
	>
	: (
		"lengthEqual" extends GenericExpectConstraint
			? GenericOutput
			: ApplyLengthEqual<GenericOutput, GenericSource>
	) extends infer InferredOutput extends readonly unknown[]
		? (
			"minElements" extends GenericExpectConstraint
				? InferredOutput
				: ApplyMinElements<InferredOutput, GenericSource>
		) extends infer InferredOutput extends readonly unknown[]
			? "maxElements" extends GenericExpectConstraint
				? InferredOutput
				: ApplyMaxElements<InferredOutput, GenericSource>
			: never
		: never;
