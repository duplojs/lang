import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { type FundamentalType, type FundamentalTypeValue } from "../fundamentalType";
import { createKind } from "../kind";
import { ErrorSymbol, type SuccessSymbol } from "../common";

export const typeKind = createKind("type");

export interface Type<
	GenericFundamentalType extends FundamentalType = FundamentalType,
	GenericValue extends FundamentalTypeValue<
		GenericFundamentalType
	> = FundamentalTypeValue<GenericFundamentalType>,
> extends DKind.Kind<typeof typeKind, GenericValue> {
	readonly fundamentalType: GenericFundamentalType;
	executeCheck(
		data: FundamentalTypeValue<
			GenericFundamentalType
		>
	): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
}

export interface CreateTypeConstructorParams<
	GenericFundamentalType extends FundamentalType = FundamentalType,
	GenericKindHandler extends DKind.Handler = DKind.Handler,
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
			data: FundamentalTypeValue<
				GenericFundamentalType
			>,
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
		init: (rest, executeCheck) => {
			const self: DKind.Remove<Type> = {
				...rest,
				executeCheck: (data: unknown) => DCommon.callThen(
					fundamentalType.executeCheck(data),
					(result) => result === ErrorSymbol
						? ErrorSymbol
						: executeCheck(self as never, data),
				),
				fundamentalType,
				[typeKind.runTimeKey]: null,
				[kindHandler.runTimeKey]: null,
			};

			return self as never;
		},
	});
}
