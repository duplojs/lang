import type * as DKind from "@scripts/kind";
import { type structureKind, type Structure } from "../base";
import { type StructureConstraintsValue } from "./constraintsValue";

export type StructureValue<
	GenericStructure extends Structure,
> = DKind.GetValue<typeof structureKind, GenericStructure>;

export type StructureInitialValue<
	GenericStructure extends Structure,
> = GenericStructure extends Structure<infer InferredValue>
	? InferredValue extends (infer InferredInitialValue) & StructureConstraintsValue<
		GenericStructure["definition"]["constraints"][number]
	>
		? InferredInitialValue
		: InferredValue
	: never;
