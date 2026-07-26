import { createKindIdentifier } from "@scripts/kind";
import { type Type } from "./base";
import { type Types } from "./types";

export const typeIdentifier = createKindIdentifier<
	Type,
	Types
>();
