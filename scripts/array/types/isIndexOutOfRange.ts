import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import type { MaxElements } from "../maxElements";
import type { LengthEqual } from "../lengthEqual";

export type IsIndexOutOfRange<
	GenericArray extends readonly unknown[],
	GenericIndex extends number,
> = DCommon.IsEqual<GenericIndex, number> extends true
	? false
	: GenericArray extends LengthEqual<infer InferredLength>
		? DNumber.IsGreaterOrEqual<GenericIndex, InferredLength>
		: GenericArray extends MaxElements<infer InferredMax>
			? DNumber.IsGreaterOrEqual<GenericIndex, InferredMax>
			: false;
