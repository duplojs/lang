import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import type { ExtractLengthEqual, ExtractMaxCharacters, ExtractMinCharacters, LengthEqual, MaxCharacters, MinCharacters } from "./constraints";

type RequireLengthEqualConstraint<
	GenericString extends string,
	GenericMin extends number,
> = ExtractLengthEqual<GenericString, unknown> extends LengthEqual<infer InferredLength>
	? DNumber.IsGreaterOrEqual<InferredLength, GenericMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MinCharacters<${GenericMin}> on LengthEqual<${InferredLength}>.`
		>
	: unknown;

type RequireMaxCharactersConstraint<
	GenericString extends string,
	GenericMin extends number,
> = ExtractMaxCharacters<GenericString, unknown> extends MaxCharacters<infer InferredMax>
	? DNumber.IsGreaterOrEqual<InferredMax, GenericMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MinCharacters<${GenericMin}> on MaxCharacters<${InferredMax}>.`
		>
	: unknown;

type RequireApplyMinCharacters<
	GenericString extends string,
	GenericMin extends number,
> = (
	& DNumber.ForbiddenNegative<GenericMin>
	& DNumber.RequireSimpleLiteral<GenericMin>
	& RequireLengthEqualConstraint<GenericString, GenericMin>
	& RequireMaxCharactersConstraint<GenericString, GenericMin>
);

type ComputeMinCharacters<
	GenericString extends string,
	GenericMin extends number,
> = GenericString extends unknown
	? ExtractLengthEqual<GenericString, unknown> extends LengthEqual<infer InferredLength>
		? DNumber.IsGreaterOrEqual<InferredLength, GenericMin> extends true
			? GenericString
			: never
		: ExtractMaxCharacters<GenericString, unknown> extends MaxCharacters<infer InferredMax>
			? DNumber.IsGreaterOrEqual<InferredMax, GenericMin> extends true
				? GenericString & MinCharacters<GenericMin>
				: never
			: ExtractMinCharacters<GenericString, unknown> extends MinCharacters<infer InferredMin>
				? DNumber.IsGreaterOrEqual<InferredMin, GenericMin> extends true
					? GenericString
					: GenericString & MinCharacters<GenericMin>
				: GenericString & MinCharacters<GenericMin>
	: never;

export function minCharacters<
	GenericString extends string,
	const GenericMin extends number,
>(
	min: GenericMin & RequireApplyMinCharacters<GenericString, GenericMin>,
): (
	string: GenericString,
) => string is ComputeMinCharacters<GenericString, GenericMin>;

export function minCharacters<
	GenericString extends string,
	const GenericMin extends number,
>(
	string: GenericString,
	min: GenericMin & RequireApplyMinCharacters<GenericString, GenericMin>,
): string is ComputeMinCharacters<GenericString, GenericMin>;

export function minCharacters(
	...args:
		| [min: number]
		| [string: string, min: number]
) {
	if (args.length === 1) {
		const [min] = args;

		return (string: string) => minCharacters(string, min as never);
	}

	const [string, min] = args;

	return string.length >= min;
}
