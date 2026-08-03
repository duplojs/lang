import { createKindIdentifier } from "@scripts/kind";
import { type FundamentalType } from "./base";
import { type FundamentalTypes } from "./types";

export const fundamentalTypeIdentifier = createKindIdentifier<
	FundamentalType,
	FundamentalTypes
>();
