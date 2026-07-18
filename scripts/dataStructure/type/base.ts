import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import { type fundamentalTypeKind, type FundamentalType } from "../fundamentalType";
import { createKind } from "../kind";
import { type SuccessSymbol, type ErrorSymbol } from "../common";

export const typeKind = createKind("type");

export interface Type<
	GenericFundamentalType extends FundamentalType = FundamentalType,
	GenericValue extends DKind.GetValue<
		typeof fundamentalTypeKind,
		GenericFundamentalType
	>["includedType"] = DKind.GetValue<
		typeof fundamentalTypeKind,
		GenericFundamentalType
	>["includedType"],
> extends DKind.Kind<typeof typeKind, GenericValue> {
	readonly fundamentalType: GenericFundamentalType;
	executeCheck(
		data: DKind.GetValue<
			typeof fundamentalTypeKind,
			GenericFundamentalType
		>["includedType"]
	): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
}

export interface CreateTypeConstructorParams<
	GenericFundamentalType extends FundamentalType,
	GenericKindHandler extends DKind.Handler,
> {
	init<
		GenericType extends (
			& Type<GenericFundamentalType>
			& DKind.Kind<GenericKindHandler>
		),
	>(
		rest: DCommon.SimplifyTopLevel<
			Omit<GenericType, keyof Type>
		>,
		executeCheck: (
			self: GenericType,
			data: DKind.GetValue<
				typeof fundamentalTypeKind,
				GenericFundamentalType
			>["includedType"],
		) => DCommon.MaybePromise<
			| SuccessSymbol
			| ErrorSymbol
		>
	): GenericType;
}

export function createType<
	GenericFundamentalType extends FundamentalType,
	GenericKindHandler extends DKind.Handler,
	GenericConstructor extends (
		(...args: any[]) => (
			& Type<GenericFundamentalType>
			& DKind.Kind<GenericKindHandler>
		)
	),
>(
	fundamentalType: GenericFundamentalType,
	kindHandler: GenericKindHandler,
	createConstructor: (
		params: CreateTypeConstructorParams<
			GenericFundamentalType,
			GenericKindHandler
		>,
	) => GenericConstructor,
): GenericConstructor {
	return createConstructor({
		init(rest, executeCheck) {
			const self: DKind.Remove<Type> = {
				...rest,
				executeCheck: (data: unknown) => executeCheck(self as never, data),
				fundamentalType,
				[typeKind.runTimeKey]: null,
				[kindHandler.runTimeKey]: null,
			};

			return self as never;
		},
	});
}
