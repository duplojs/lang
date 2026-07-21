import type { LengthEqual } from "../lengthEqual";
import type { MaxElements } from "../maxElements";
import type { MinElements } from "../minElements";

export type ReapplyConstraints<
	GenericSource extends readonly unknown[],
	GenericOutput extends readonly unknown[],
> =
	GenericSource extends LengthEqual<infer InferredLength>
		? GenericOutput & LengthEqual<InferredLength>
		: (
			GenericSource extends MinElements<infer InferredMin>
				? GenericOutput & MinElements<InferredMin>
				: GenericOutput
		) extends infer InferredOutput extends readonly unknown[]
			? GenericSource extends MaxElements<infer InferredMax>
				? InferredOutput & MaxElements<InferredMax>
				: InferredOutput
			: never;
