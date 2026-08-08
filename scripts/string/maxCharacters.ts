import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import type { ExtractLengthEqual, ExtractMaxCharacters, ExtractMinCharacters, LengthEqual, MaxCharacters, MinCharacters } from "./constraints";

type RequireLengthEqualConstraint<
	GenericString extends string,
	GenericMax extends number,
> = ExtractLengthEqual<GenericString, unknown> extends LengthEqual<infer InferredLength>
	? DNumber.IsGreaterOrEqual<GenericMax, InferredLength> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MaxCharacters<${GenericMax}> on LengthEqual<${InferredLength}>.`
		>
	: unknown;

type RequireMinCharactersConstraint<
	GenericString extends string,
	GenericMax extends number,
> = ExtractMinCharacters<GenericString, unknown> extends MinCharacters<infer InferredMin>
	? DNumber.IsGreaterOrEqual<GenericMax, InferredMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MaxCharacters<${GenericMax}> on MinCharacters<${InferredMin}>.`
		>
	: unknown;

type RequireApplyMaxCharacters<
	GenericString extends string,
	GenericMax extends number,
> = (
	& DNumber.ForbiddenNegative<GenericMax>
	& DNumber.RequireSimpleLiteral<GenericMax>
	& RequireLengthEqualConstraint<GenericString, GenericMax>
	& RequireMinCharactersConstraint<GenericString, GenericMax>
);

type ComputeMaxCharacters<
	GenericString extends string,
	GenericMax extends number,
> = GenericString extends unknown
	? ExtractLengthEqual<GenericString, unknown> extends LengthEqual<infer InferredLength>
		? DNumber.IsGreaterOrEqual<GenericMax, InferredLength> extends true
			? GenericString
			: never
		: ExtractMinCharacters<GenericString, unknown> extends MinCharacters<infer InferredMin>
			? DNumber.IsGreaterOrEqual<GenericMax, InferredMin> extends true
				? GenericString & MaxCharacters<GenericMax>
				: never
			: ExtractMaxCharacters<GenericString, unknown> extends MaxCharacters<infer InferredMax>
				? DNumber.IsGreaterOrEqual<GenericMax, InferredMax> extends true
					? GenericString
					: GenericString & MaxCharacters<GenericMax>
				: GenericString & MaxCharacters<GenericMax>
	: never;

export function maxCharacters<
	GenericString extends string,
	const GenericMax extends number,
>(
	max: GenericMax & RequireApplyMaxCharacters<GenericString, GenericMax>,
): (
	string: GenericString,
) => string is ComputeMaxCharacters<GenericString, GenericMax>;

export function maxCharacters<
	GenericString extends string,
	const GenericMax extends number,
>(
	string: GenericString,
	max: GenericMax & RequireApplyMaxCharacters<GenericString, GenericMax>,
): string is ComputeMaxCharacters<GenericString, GenericMax>;

export function maxCharacters(
	...args:
		| [max: number]
		| [string: string, max: number]
) {
	if (args.length === 1) {
		const [max] = args;

		return (string: string) => maxCharacters(string, max as never);
	}

	const [string, max] = args;

	return string.length <= max;
}
