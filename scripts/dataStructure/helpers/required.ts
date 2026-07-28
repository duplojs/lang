import { type ObjectStructure, type Structure, unionStructureKind, typeStructureKind, structureIdentifier, type StructureInitialValue } from "../structure";
import { typeIdentifier, undefinedTypeKind } from "../type";
import { union } from "./union";
import { object } from "./object";

function isUndefinedStructure(structure: Structure) {
	return (
		structureIdentifier(structure, typeStructureKind)
		&& typeIdentifier(
			structure.definition.type,
			undefinedTypeKind,
		)
	);
}

function requiredStructure(structure: Structure) {
	if (!structureIdentifier(structure, unionStructureKind)) {
		return structure;
	}

	const values = structure.definition.values.filter(
		(value) => !isUndefinedStructure(value),
	);

	if (values.length === 1) {
		return values[0]!;
	}

	if (values.length === structure.definition.values.length) {
		return structure;
	}

	return union(values as [Structure, ...Structure[]]);
}

export function required<
	GenericObjectStructure extends ObjectStructure,
	GenericObjectStructureValue extends StructureInitialValue<GenericObjectStructure>,
>(
	structure: GenericObjectStructure,
): ObjectStructure<
	{
		readonly [Prop in keyof GenericObjectStructureValue]-?: Exclude<
			GenericObjectStructureValue[Prop],
			undefined
		>
	}
>;

export function required(
	structure: ObjectStructure,
): ObjectStructure {
	return object(
		Object.fromEntries(
			structure.definition.shape.value.map(
				(entry) => [
					entry.key,
					requiredStructure(entry.value),
				],
			),
		),
	);
}
