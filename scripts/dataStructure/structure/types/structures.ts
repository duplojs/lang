import { type Structure } from "../base";
import { type ObjectStructure, type ArrayStructure, type RecordStructure, type UnionStructure, type TypeStructure } from "../defaults";

export interface StructuresStore {
	base: Structure;
	array: ArrayStructure;
	object: ObjectStructure;
	record: RecordStructure;
	union: UnionStructure;
	type: TypeStructure;
}

export type Structures = Extract<
	StructuresStore[keyof StructuresStore],
	Structure
>;
