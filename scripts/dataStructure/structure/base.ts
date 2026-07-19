import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { createKind } from "../kind";
import { ErrorSymbol, SuccessSymbol } from "../common";
import { type ConstraintValue, type Constraint } from "../constraint";
import { type CodecContext } from "../codec";

export class StructureClass {
	private constructor() {}

	public static init(params: DKind.Remove<Structure>) {
		const self = new StructureClass();
		DCommon.bindPrototypeMethods(self);
		for (const key in params) {
			self[key as never] = params[key as never];
		}

		return self as Structure;
	}
}

export const structureKind = createKind("structure");

export interface StructureDefinition<
	GenericConstraints extends readonly Constraint[] = readonly Constraint[],
> {
	readonly constraints: readonly [...GenericConstraints];
}

export interface Structure<
	GenericValue extends unknown = unknown,
	GenericDefinition extends StructureDefinition<
		readonly Constraint<GenericValue>[]
	> = StructureDefinition<readonly Constraint<GenericValue>[]>,
> extends StructureClass, DKind.Kind<
		typeof structureKind,
		(
			& GenericValue
			& DCommon.UnionToIntersection<
				ConstraintValue<GenericDefinition["constraints"][number]>
			>
		)
	> {
	readonly definition: GenericDefinition;
	executeCheck(data: unknown): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	addConstraint<
		const GenericNewConstraints extends DCommon.AnyTuple<Constraint<GenericValue>>,
	>(
		...args: GenericNewConstraints
	): Structure<
		GenericValue,
		StructureDefinition<
			readonly [...this["definition"]["constraints"], ...GenericNewConstraints]
		>
	>;
	executeEncode(
		codecContext: CodecContext,
		data: unknown,
	): unknown;
	executeDecode(
		codecContext: CodecContext,
		data: unknown,
	): unknown;
}

export interface CreateStructureConstructorParams<
	GenericKindHandler extends DKind.Handler = DKind.Handler,
> {
	init<
		GenericStructure extends (
			& Structure<any>
			& DKind.Kind<GenericKindHandler>
		),
	>(
		definition: GenericStructure["definition"],
		executeCheck: (
			self: GenericStructure,
			data: unknown,
		) => DCommon.MaybePromise<
			| SuccessSymbol
			| ErrorSymbol
		>
	): GenericStructure;
}

export function createStructure<
	GenericKindHandler extends DKind.Handler,
	GenericConstructor extends (
		(...args: any[]) => (
			& Structure<any>
			& DKind.Kind<GenericKindHandler>
		)
	),
>(
	kindHandler: GenericKindHandler,
	createConstructor: (
		params: CreateStructureConstructorParams<
			GenericKindHandler
		>,
	) => GenericConstructor,
): GenericConstructor {
	const init: CreateStructureConstructorParams["init"] = (definition, executeCheck) => {
		const self = StructureClass.init({
			executeCheck: (data) => DCommon.callThen(
				executeCheck(self as never, data),
				(result) => result === ErrorSymbol
					? ErrorSymbol
					: definition.constraints.reduce<
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
			definition,
			addConstraint: (...args) => init(
				{
					...definition,
					constraints: [
						...definition.constraints,
						...args,
					],
				},
				executeCheck,
			) as never,
			executeEncode: () => {},
			executeDecode: () => {},
			[kindHandler.runTimeKey]: null,
			[structureKind.runTimeKey]: null,
		});

		return self as never;
	};

	return createConstructor({
		init,
	});
}
