import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import { createKind } from "../kind";
import { type SuccessSymbol, type ErrorSymbol } from "../common";

export const constraintKind = createKind("constraint");

export interface Constraint<
	GenericInput extends unknown = unknown,
	GenericChecked extends GenericInput = GenericInput,
> extends DKind.Kind<typeof constraintKind, GenericChecked> {
	executeCheck(input: GenericInput): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
}

export interface CreateConstraintConstructorParams<
	GenericKindHandler extends DKind.Handler,
> {
	init<
		GenericConstraint extends (
			& Constraint
			& DKind.Kind<GenericKindHandler>
		),
	>(
		rest: DCommon.SimplifyTopLevel<
			Omit<GenericConstraint, keyof Constraint>
		>,
		executeCheck: (
			self: GenericConstraint,
			data: Parameters<GenericConstraint["executeCheck"]>[0],
		) => DCommon.MaybePromise<
			| SuccessSymbol
			| ErrorSymbol
		>
	): GenericConstraint;
}

export function createConstraint<
	GenericKindHandler extends DKind.Handler,
	GenericConstructor extends (
		(...args: any[]) => (
			& Constraint
			& DKind.Kind<GenericKindHandler>
		)
	),
>(
	kindHandler: GenericKindHandler,
	createConstructor: (
		params: CreateConstraintConstructorParams<
			GenericKindHandler
		>,
	) => GenericConstructor,
): GenericConstructor {
	return createConstructor({
		init(rest, executeCheck) {
			const self: DKind.Remove<Constraint> = {
				...rest,
				executeCheck: (data: unknown) => executeCheck(self as never, data),
				[constraintKind.runTimeKey]: null,
				[kindHandler.runTimeKey]: null,
			};

			return self as never;
		},
	});
}
