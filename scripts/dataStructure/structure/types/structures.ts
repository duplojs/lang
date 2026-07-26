import { type Structure } from "../base";
import { type ObjectStructure, type ArrayStructure, type UnionStructure } from "../defaults";

export interface StructuresStore {
	base: Structure;
	array: ArrayStructure;
	object: ObjectStructure;
	union: UnionStructure;
}

export type Structures = Extract<
	StructuresStore[keyof StructuresStore],
	Structure
>;
