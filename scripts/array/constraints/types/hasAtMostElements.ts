import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import type { MaxElements } from "../maxElements";
import type { LengthEqual } from "../lengthEqual";

export type HasAtMostElements<
	GenericArray extends readonly unknown[],
	GenericMax extends number,
> = DCommon.IsEqual<GenericMax, number> extends true
	? false
	: GenericArray extends LengthEqual<infer InferredLength>
		? DNumber.IsGreaterOrEqual<GenericMax, InferredLength>
		: GenericArray extends MaxElements<infer InferredMax>
			? DNumber.IsGreaterOrEqual<GenericMax, InferredMax>
			: false;
