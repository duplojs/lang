import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import { createKind } from "../kind";
import { type SuccessSymbol, type ErrorSymbol, type GetErrorHandler } from "../common";

export const constraintKind = createKind("constraint");

export interface ConstraintDefinition {}

export interface Constraint<
	GenericInput extends unknown = unknown,
	GenericChecked extends GenericInput = GenericInput,
	GenericDefinition extends ConstraintDefinition = ConstraintDefinition,
> extends DKind.Kind<typeof constraintKind, GenericChecked> {
	readonly definition: GenericDefinition;
	executeCheck(
		input: GenericInput,
		errorHandler?: GetErrorHandler
	): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	isAsynchronous(): boolean;
}

export interface CreateConstraintInitParams<
	GenericConstraint extends Constraint = Constraint,
> {
	executeCheck(
		self: GenericConstraint,
		data: Parameters<GenericConstraint["executeCheck"]>[0],
		errorHandler?: GetErrorHandler
	): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	isAsynchronous(self: GenericConstraint): boolean;
}

export interface CreateConstraintConstructorParams<
	GenericKindHandler extends DKind.Handler = DKind.Handler,
> {
	init<
		GenericConstraint extends (
			& Constraint
			& DKind.Kind<GenericKindHandler>
		),
	>(
		definition: GenericConstraint["definition"],
		params: CreateConstraintInitParams<GenericConstraint>,
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
		init: (
			definition,
			{
				executeCheck,
				isAsynchronous,
			},
		) => {
			const self: DKind.Remove<Constraint> = {
				definition,
				executeCheck: (data: unknown, errorHandler) => executeCheck(
					self as never,
					data,
					errorHandler,
				),
				isAsynchronous: () => isAsynchronous(self as never),
				[constraintKind.runTimeKey]: null,
				[kindHandler.runTimeKey]: null,
			};

			return self as never;
		},
	});
}
