import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";

declare module "@scripts/dataStructure" {
	interface StructuresStore {
		entityName: EntityNameStructure;
	}
}

export const entityNameStructureKind = DDataStructure.createKind("entity-name-structure");

export interface EntityNameStructure extends DCommon.UnionToIntersection<
		& DDataStructure.Structure<
			unknown
		>
		& DKind.Kind<typeof entityNameStructureKind>
> {
	readonly name: string;
}

export const EntityNameStructure = DDataStructure.createStructure(
	entityNameStructureKind,
	({ init }) => (
		name: string,
	) => init<
		EntityNameStructure
	>(
		{ constraints: [] },
		{
			executeCheck: (self, data, errorHandler) => data === name
				? DDataStructure.SuccessSymbol
				: errorHandler?.().addIssue(self, data) ?? DDataStructure.ErrorSymbol,
			executeEncode: (self, codecContext, data, errorHandler) => data === name
				? data
				: errorHandler?.().addIssue(self, data) ?? DDataStructure.ErrorSymbol,
			executeDecode: (self, codecContext, data, errorHandler) => data === name
				? data
				: errorHandler?.().addIssue(self, data) ?? DDataStructure.ErrorSymbol,
			isAsynchronous: () => false,
		},
		{ name },
	),
);
