import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { createKind } from "../kind";
import { type TypeValue, type Type } from "../type";
import { ErrorSymbol, SuccessSymbol } from "../common";
import { type ConstraintValue, type Constraint } from "../constraint";

export const structureKind = createKind("structure");

export interface Structure<
	GenericType extends Type = Type,
	GenericConstraints extends readonly Constraint[] = readonly Constraint[],
> extends DKind.Kind<
		typeof structureKind,
		(
			& TypeValue<GenericType>
			& DCommon.UnionToIntersection<
				ConstraintValue<GenericConstraints[number]>
			>
		)
	> {
	readonly type: GenericType;
	readonly constraints: GenericConstraints;
	executeCheck(data: unknown): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	addConstraint<
		GenericNewConstraints extends DCommon.AnyTuple<Constraint<TypeValue<GenericType>>>,
	>(
		...args: GenericNewConstraints
	): Structure<
		GenericType,
		readonly [...GenericConstraints, ...GenericNewConstraints]
	>;
	// await either check(data: unknown):
}

export function createStructure<
	GenericType extends Type,
	const GenericConstraints extends readonly Constraint<TypeValue<GenericType>>[] = readonly [],
>(
	type: GenericType,
	constraints: GenericConstraints = [] as never,
): Structure<GenericType, GenericConstraints> {
	const self: DKind.Remove<Structure> = {
		type,
		executeCheck: (data: unknown) => DCommon.callThen(
			type.fundamentalType.executeCheck(data),
			(result) => result === ErrorSymbol
				? ErrorSymbol
				: DCommon.callThen(
					type.executeCheck(data),
					(result) => result === ErrorSymbol
						? ErrorSymbol
						: constraints.reduce<
							DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>
						>(
							(accumulator, constraint) => DCommon.callThen(
								accumulator,
								(result) => result === ErrorSymbol
									? ErrorSymbol
									: constraint.executeCheck(data),
							),
							SuccessSymbol,
						),
				),
		),
		addConstraint: (...newConstraints) => createStructure(
			type,
			[...self.constraints, ...newConstraints],
		),
		constraints,
		[structureKind.runTimeKey]: null,
	};

	return self as never;
}
