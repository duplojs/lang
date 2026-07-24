import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import type { MinElements } from "../minElements";
import type { LengthEqual } from "../lengthEqual";

export type HasAtLeastElements<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
> = DCommon.IsEqual<GenericMin, number> extends true
	? false
	: GenericArray extends LengthEqual<infer InferredLength>
		? DNumber.IsGreaterOrEqual<InferredLength, GenericMin>
		: GenericArray extends MinElements<infer InferredMin>
			? DNumber.IsGreaterOrEqual<InferredMin, GenericMin>
			: false;
