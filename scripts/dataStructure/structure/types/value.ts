import { type structureKind, type Structure } from "../base";
import type * as DKind from "@scripts/kind";

export type StructureValue<
	GenericStructure extends Structure,
> = DKind.GetValue<typeof structureKind, GenericStructure>;
