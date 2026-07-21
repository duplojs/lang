import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import type { MinElements } from "../minElements";
import type { LengthEqual } from "../lengthEqual";

export type IsIndexCovered<
	GenericArray extends readonly unknown[],
	GenericIndex extends number,
> = DCommon.IsEqual<GenericIndex, number> extends true
	? false
	: GenericArray extends LengthEqual<infer InferredLength>
		? DNumber.IsGreater<InferredLength, GenericIndex>
		: GenericArray extends MinElements<infer InferredMin>
			? DNumber.IsGreater<InferredMin, GenericIndex>
			: false;
