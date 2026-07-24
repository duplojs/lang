import type * as DCommon from "@scripts/common";
import type { LengthEqual } from "../lengthEqual";

export type HasExactLength<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
> = GenericArray extends LengthEqual<infer InferredLength>
	? DCommon.IsEqual<InferredLength, GenericLength>
	: false;
