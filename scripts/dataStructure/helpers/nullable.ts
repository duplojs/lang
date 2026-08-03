import { type Structure, type StructureInitialValue, type StructureValue, type UnionStructure, structureIdentifier, unionStructureKind } from "../structure";
import { union } from "./union";
import { null as nullHelper } from "./null";
import { isNullStructure } from "./isNullStructure";

export function nullable<
	GenericStructure extends Structure,
>(
	structure: GenericStructure,
): UnionStructure<
	(
		GenericStructure extends UnionStructure
			? StructureInitialValue<GenericStructure>
			: StructureValue<GenericStructure>
	) | null,
	readonly []
>;

export function nullable(
	structure: Structure,
): UnionStructure {
	if (structureIdentifier(structure, unionStructureKind)) {
		return structure.definition.values.some(isNullStructure)
			? union(structure.definition.values)
			: union([
				nullHelper(),
				...structure.definition.values,
			]);
	}

	return union([
		nullHelper(),
		structure,
	]);
}
