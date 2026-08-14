import { type ObjectStructure, type Structure, unionStructureKind, structureIdentifier, type StructureInitialValue } from "../structure";
import { undefined as undefinedHelper } from "./undefined";
import { union } from "./union";
import { object } from "./object";
import { isUndefinedStructure } from "./isUndefinedStructure";

function partialStructure(structure: Structure) {
	if (isUndefinedStructure(structure)) {
		return structure;
	}

	if (structureIdentifier(structure, unionStructureKind)) {
		return structure.definition.values.some(isUndefinedStructure)
			? structure
			: union([
				undefinedHelper(),
				...structure.definition.values,
			]);
	}

	return union(
		[
			undefinedHelper(),
			structure,
		],
	);
}

export function partial<
	GenericObjectStructure extends ObjectStructure,
	GenericObjectStructureValue extends StructureInitialValue<GenericObjectStructure>,
>(
	structure: GenericObjectStructure,
): ObjectStructure<
	{
		readonly [Prop in keyof GenericObjectStructureValue]?: (
			| GenericObjectStructureValue[Prop]
			| undefined
		)
	},
	readonly []
>;

export function partial(
	structure: ObjectStructure,
): ObjectStructure {
	return object(
		Object.fromEntries(
			structure.definition.shape.value.map(
				(entry) => [
					entry.key,
					partialStructure(entry.value),
				],
			),
		),
	);
}
