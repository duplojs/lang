import { type Structure, type StructureInitialValue, type StructureValue, type UnionStructure, structureIdentifier, typeStructureKind, unionStructureKind } from "../structure";
import { nullTypeKind, typeIdentifier } from "../type";
import { union } from "./union";
import { null as nullHelper } from "./null";

function isNullStructure(structure: Structure) {
	return (
		structureIdentifier(structure, typeStructureKind)
		&& typeIdentifier(
			structure.definition.type,
			nullTypeKind,
		)
	);
}

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
