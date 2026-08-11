import type * as DKind from "@scripts/kind";
import * as DDataStructure from "@scripts/dataStructure";
import { createKind } from "../kind";
import { type EntityStructure, type Entity, type GetEntityName } from "../entity";

export const flagKind = createKind<
	"flag",
	Record<string, unknown>
>("flag");

export interface Flag<
	GenericName extends string = string,
	GenericValue extends unknown = never,
> extends DKind.Kind<
		typeof flagKind,
		Record<GenericName, GenericValue>
	> {

}

const flagHandlerKind = createKind("flag-handler");

export interface FlagHandler<
	GenericEntity extends Entity = Entity,
	GenericName extends string = string,
	GenericValue extends unknown = unknown,
> extends DKind.Kind<typeof flagHandlerKind> {
	readonly name: GenericName;

	readonly entityStructure: EntityStructure<
		GetEntityName<GenericEntity>,
		Omit<GenericEntity, DKind.KeySymbol>
	>;

	readonly valueStructure: DDataStructure.Structure<GenericValue>;

	append<
		GenericInputEntity extends GenericEntity,
		const GenericInputValue extends GenericValue,
	>(
		value: GenericInputValue
	): (entity: GenericInputEntity) => (
		& GenericInputEntity
		& Flag<GenericName, GenericInputValue>
	);

	append<
		GenericInputEntity extends GenericEntity,
		const GenericInputValue extends GenericValue,
	>(
		entity: GenericInputEntity,
		value: GenericInputValue
	): (
		& GenericInputEntity
		& Flag<GenericName, GenericInputValue>
	);

	getValue<
		GenericInputEntity extends GenericEntity & Flag<GenericName, GenericValue>,
	>(
		entity: GenericInputEntity
	): DKind.GetValue<
		typeof flagKind,
		GenericInputEntity
	>[GenericName];

	has<
		GenericInputEntity extends GenericEntity,
	>(
		entity: GenericInputEntity
	): entity is Extract<
		GenericInputEntity,
		Flag<GenericName, any>
	>;
}

export function createFlag<
	GenericEntityStructure extends EntityStructure,
	GenericName extends Capitalize<string>,
	GenericValueStructure extends DDataStructure.Structure = DDataStructure.Structure<null>,
>(
	entityStructure: GenericEntityStructure,
	name: GenericName,
	valueStructure: GenericValueStructure = DDataStructure.TypeStructure(DDataStructure.NullType(), []) as never,
): FlagHandler<
	DDataStructure.StructureValue<GenericEntityStructure>,
	GenericName,
	DDataStructure.StructureValue<GenericValueStructure>
> {
	function append(...args: [unknown] | [Entity, unknown]) {
		if (args.length === 1) {
			const [value] = args;
			return (entity: Entity) => append(entity, value);
		}

		const [entity, value] = args;
		const flagValue = flagKind.has(entity)
			? {
				...(flagKind.getValue(entity) as object),
				[name]: value,
			}
			: { [name]: value };

		return flagKind.addTo(
			entity,
			flagValue,
		);
	}

	return {
		name,
		entityStructure,
		valueStructure,
		append,
		getValue(entity: Entity) {
			return flagKind.getValue(entity as never)[name];
		},
		has(entity: Entity) {
			return flagKind.has(entity as never)
				&& name in flagKind.getValue(entity as never);
		},
		[flagHandlerKind.runTimeKey]: null,
	} satisfies Record<keyof DKind.Remove<FlagHandler>, unknown> as never;
}

export type GetFlag<
	GenericHandler extends FlagHandler<any, any, any>,
> = GenericHandler extends FlagHandler<
	any,
	infer InferredName,
	infer InferredValue
>
	? Flag<InferredName, InferredValue>
	: never;
