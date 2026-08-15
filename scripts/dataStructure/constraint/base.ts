import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { createKind } from "../kind";
import { type SuccessSymbol, type ErrorSymbol } from "../common";

export const constraintKind = createKind("constraint");

export interface ConstraintDefinition {
	readonly message?: string;
}

declare const BivariousSymbol: unique symbol;

export interface Constraint<
	GenericInput extends unknown = unknown,
	GenericChecked extends GenericInput = GenericInput,
	GenericDefinition extends ConstraintDefinition = ConstraintDefinition,
> extends DKind.Kind<
		typeof constraintKind,
		DCommon.IsEqual<GenericInput, GenericChecked> extends true
			? any
			: GenericChecked
	> {
	readonly definition: GenericDefinition;
	readonly [BivariousSymbol]?: DCommon.IsUnion<GenericInput> extends true
		? (input: GenericInput) => void
		: unknown;
	executeCheck(
		data: GenericInput,
	): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	isAsynchronous(): boolean;
	clone(): this;
	setMessage(massage: string): this;
	addMessage(massage: string): this;
}

export interface CreateConstraintInitParams<
	GenericConstraint extends Constraint = Constraint,
> {
	executeCheck(
		self: GenericConstraint,
		data: Parameters<GenericConstraint["executeCheck"]>[0],
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
	const init: CreateConstraintConstructorParams["init"] = (
		definition,
		{
			executeCheck,
			isAsynchronous,
		},
	) => {
		const self: Constraint = {
			definition,
			executeCheck: (data: unknown) => executeCheck(
				self as never,
				data,
			),
			isAsynchronous: () => isAsynchronous(self as never),
			clone: () => init(
				DCommon.simpleClone(definition),
				{
					executeCheck,
					isAsynchronous,
				},
			),
			setMessage: (message) => {
				(self.definition.message as any) = message as any;
				return self;
			},
			addMessage: (message) => {
				const cloneSelf = self.clone();
				return cloneSelf.setMessage(message);
			},
			[constraintKind.runTimeKey]: null,
			[kindHandler.runTimeKey]: null,
		} satisfies DKind.Remove<Constraint> as never;

		return self as never;
	};

	return createConstructor({
		init,
	});
}
