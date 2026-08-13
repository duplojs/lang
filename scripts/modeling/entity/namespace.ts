import type * as DCommon from "@scripts/common";
import type * as DDataStructure from "@scripts/dataStructure";
import type * as DKind from "@scripts/kind";
import { createNewEntity, type ForbiddenTopLevelNewType, type NewTypeStructure } from "../newType";
import { createEntity, type ForbiddenMissingNewTypeInEntityShape } from "./helper";
import { type EntityStructure } from "./base";
import { createFlag, type FlagHandler } from "../flag";
import { createKind } from "../kind";

export const namespaceKind = createKind("namespace");

export interface EntityNamespace<
	GenericEntityName extends Capitalize<string> = Capitalize<string>,
> extends DKind.Kind<typeof namespaceKind> {
	readonly name: GenericEntityName;

	createNewType<
		GenericName extends Capitalize<string>,
		GenericStructure extends DDataStructure.Structure,
		const GenericNewTypeConstraint extends readonly DDataStructure.Constraint<
			DDataStructure.StructureValue<GenericStructure>
		>[] = readonly [],
	>(
		name: (
			& GenericName
			& DCommon.NeverCoalescing<
				ForbiddenTopLevelNewType<
					DDataStructure.StructureValue<GenericStructure>
				>,
				unknown
			>
		),
		structure: GenericStructure,
		newTypeConstraints?: GenericNewTypeConstraint,
	): NewTypeStructure<
		`${GenericEntityName}${GenericName}`,
		DDataStructure.StructureValue<GenericStructure>,
		GenericNewTypeConstraint
	>;

	createEntity<
		GenericShape extends DDataStructure.ShapeObjectStructure,
	>(
		shape: () => (
			& GenericShape
			& DCommon.NeverCoalescing<
				ForbiddenMissingNewTypeInEntityShape<
					DDataStructure.ShapeObjectStructureValue<GenericShape>
				>,
				unknown
			>
		)
	): EntityStructure<
		GenericEntityName,
		DDataStructure.ShapeObjectStructureValue<GenericShape>
	>;

	createFlag<
		GenericEntityStructure extends EntityStructure<GenericEntityName>,
		GenericName extends Capitalize<string>,
		GenericValueStructure extends DDataStructure.Structure,
	>(
		entityStructure: GenericEntityStructure,
		name: GenericName,
		valueStructure: GenericValueStructure,
	): FlagHandler<
		DDataStructure.StructureValue<GenericEntityStructure>,
		`${GenericEntityName}${GenericName}`,
		DDataStructure.StructureValue<GenericValueStructure>
	>;
}

export function createEntityNamespace<
	GenericName extends Capitalize<string>,
>(entityName: GenericName): EntityNamespace<GenericName> {
	return {
		name: entityName,
		createNewType: (
			name,
			structure,
			newTypeConstraints = [] as never,
		) => createNewEntity(
			`${entityName}${name}` as never,
			structure,
			newTypeConstraints,
		),
		createEntity: (
			shape,
		) => createEntity(
			entityName,
			shape,
		),
		createFlag: (
			entityStructure,
			name,
			valueStructure,
		) => createFlag(
			entityStructure,
			`${entityName}${name}` as never,
			valueStructure,
		),
		[namespaceKind.runTimeKey]: null,
	} satisfies DKind.Remove<EntityNamespace> as never;
}
