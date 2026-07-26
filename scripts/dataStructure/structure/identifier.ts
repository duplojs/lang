import { createKindIdentifier } from "@scripts/kind";
import { type Structure } from "./base";
import { type Structures } from "./types";

export const structureIdentifier = createKindIdentifier<
	Structure,
	Structures
>();
