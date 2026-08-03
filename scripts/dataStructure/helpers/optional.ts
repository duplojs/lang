import { type Structure, type StructureInitialValue, type StructureValue, type UnionStructure, structureIdentifier, unionStructureKind } from "../structure";
import { union } from "./union";
import { undefined as undefinedHelper } from "./undefined";
import { isUndefinedStructure } from "./isUndefinedStructure";

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
