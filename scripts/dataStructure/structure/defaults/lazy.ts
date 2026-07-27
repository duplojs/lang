import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { type Constraint } from "../../constraint";
import { createStructure, type StructureDefinition, type Structure } from "../base";
import { createKind } from "../../kind";
import { type StructureValue } from "../types";

export const lazyStructureKind = createKind("lazy-structure");

export interface LazyStructureDefinition<
	GenericConstraints extends readonly Constraint[] = readonly Constraint[],
> extends StructureDefinition<GenericConstraints> {
	readonly getter: DCommon.Memoized<Structure>;
}

export interface LazyStructure<
	GenericValue extends unknown = unknown,
	GenericConstraints extends readonly Constraint<GenericValue>[] =
		readonly Constraint<GenericValue>[],
> extends DCommon.UnionToIntersection<
		& Structure<GenericValue, LazyStructureDefinition<GenericConstraints>>
		& DKind.Kind<typeof lazyStructureKind>
	> {

	/*
	addConstraint<
		const GenericNewConstraints extends DCommon.AnyTuple<Constraint<GenericValue>>,
	>(
		...args: GenericNewConstraints
	): LazyStructure<
		GenericValue,
		readonly [...GenericConstraints, ...GenericNewConstraints]
	>;
	*/
}

export const LazyStructure = createStructure(
	lazyStructureKind,
	({ init }) => <
		GenericStructure extends Structure,
		GenericValue extends StructureValue<GenericStructure>,
		const GenericConstraints extends readonly Constraint<GenericValue>[] = readonly [],
	>(
		getStructure: () => GenericStructure,
		constraints: GenericConstraints,
	) => init<
		LazyStructure<
			GenericValue,
			readonly [...GenericConstraints]
		>
	>(
		{
			getter: DCommon.memo(getStructure),
			constraints,
		},
		{
			executeCheck: (self, data, errorHandler) => self.definition.getter.value.executeCheck(
				data,
				errorHandler,
			),
			executeEncode: (self, codecContext, data, errorHandler) => self.definition.getter.value.executeEncode(
				codecContext,
				data,
				errorHandler,
			),
			executeDecode: (self, codecContext, data, errorHandler) => self.definition.getter.value.executeDecode(
				codecContext,
				data,
				errorHandler,
			),
			isAsynchronous: (self) => self.definition.getter.value.isAsynchronous(),
		},
	),
);
