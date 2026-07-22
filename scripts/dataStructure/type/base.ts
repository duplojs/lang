import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import { type FundamentalType, type FundamentalTypeValue } from "../fundamentalType";
import { createKind } from "../kind";
import { ErrorSymbol, type GetErrorHandler, type SuccessSymbol } from "../common";

export const typeKind = createKind("type");

export interface TypeDefinition {}

export interface Type<
	GenericFundamentalType extends FundamentalType = FundamentalType,
	GenericValue extends FundamentalTypeValue<
		GenericFundamentalType
	> = FundamentalTypeValue<GenericFundamentalType>,
	GenericDefinition extends TypeDefinition = TypeDefinition,
> extends DKind.Kind<typeof typeKind, GenericValue> {
	readonly fundamentalType: GenericFundamentalType;
	readonly definition: GenericDefinition;
	executeCheck(
		data: FundamentalTypeValue<
			GenericFundamentalType
		>,
		errorHandler?: GetErrorHandler
	): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	isAsynchronous(): boolean;
}

export interface CreateTypeInitParams<
	GenericType extends Type = Type,
	GenericFundamentalType extends FundamentalType = FundamentalType,
> {
	executeCheck(
		self: GenericType,
		data: FundamentalTypeValue<
			GenericFundamentalType
		>,
		errorHandler?: GetErrorHandler
	): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	isAsynchronous(self: GenericType): boolean;
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
		definition: GenericType["definition"],
		params: CreateTypeInitParams<GenericType, GenericFundamentalType>,
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
		init: (
			definition,
			{
				executeCheck,
				isAsynchronous,
			},
		) => {
			const self: DKind.Remove<Type> = {
				definition,
				executeCheck: (
					data: unknown,
					errorHandler,
				) => self.fundamentalType.executeCheck(data, errorHandler) === ErrorSymbol
					? ErrorSymbol
					: executeCheck(self as never, data, errorHandler),
				isAsynchronous: () => isAsynchronous(self as never),
				fundamentalType,
				[typeKind.runTimeKey]: null,
				[kindHandler.runTimeKey]: null,
			};

			return self as never;
		},
	});
}
