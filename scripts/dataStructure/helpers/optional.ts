import { type Structure, type StructureInitialValue, type StructureValue, type UnionStructure, structureIdentifier, typeStructureKind, unionStructureKind } from "../structure";
import { typeIdentifier, undefinedTypeKind } from "../type";
import { union } from "./union";
import { undefined as undefinedHelper } from "./undefined";

function isUndefinedStructure(structure: Structure) {
	return (
		structureIdentifier(structure, typeStructureKind)
		&& typeIdentifier(
			structure.definition.type,
			undefinedTypeKind,
		)
	);
}

export function optional<
	GenericStructure extends Structure,
>(
	structure: GenericStructure,
): UnionStructure<
	(
		GenericStructure extends UnionStructure
			? StructureInitialValue<GenericStructure>
			: StructureValue<GenericStructure>
	) | undefined,
	readonly []
>;

export function optional(
	structure: Structure,
): UnionStructure {
	if (structureIdentifier(structure, unionStructureKind)) {
		return structure.definition.values.some(isUndefinedStructure)
			? union(structure.definition.values)
			: union([
				undefinedHelper(),
				...structure.definition.values,
			]);
	}

	return union([
		undefinedHelper(),
		structure,
	]);
}
