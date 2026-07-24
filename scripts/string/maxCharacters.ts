import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import type { LengthEqual, MaxCharacters, MinCharacters } from "./constraints";

type RequireLengthEqualConstraint<
	GenericString extends string,
	GenericMax extends number,
> = GenericString extends LengthEqual<infer InferredLength>
	? DNumber.IsGreaterOrEqual<GenericMax, InferredLength> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MaxCharacters<${GenericMax}> on LengthEqual<${InferredLength}>.`
		>
	: unknown;

type RequireMinCharactersConstraint<
	GenericString extends string,
	GenericMax extends number,
> = GenericString extends MinCharacters<infer InferredMin>
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
	& RequireLengthEqualConstraint<GenericString, GenericMax>
	& RequireMinCharactersConstraint<GenericString, GenericMax>
);

type ComputeMaxCharacters<
	GenericString extends string,
	GenericMax extends number,
> = GenericString extends LengthEqual<infer InferredLength>
	? DNumber.IsGreaterOrEqual<GenericMax, InferredLength> extends true
		? GenericString
		: never
	: GenericString extends MinCharacters<infer InferredMin>
		? DNumber.IsGreaterOrEqual<GenericMax, InferredMin> extends true
			? GenericString & MaxCharacters<GenericMax>
			: never
		: GenericString extends MaxCharacters<infer InferredMax>
			? DNumber.IsGreaterOrEqual<GenericMax, InferredMax> extends true
				? GenericString
				: GenericString & MaxCharacters<GenericMax>
			: GenericString & MaxCharacters<GenericMax>;

export function maxCharacters<
	GenericString extends string,
	GenericMax extends number,
>(
	max: GenericMax & RequireApplyMaxCharacters<GenericString, GenericMax>,
): (
	string: GenericString,
) => string is ComputeMaxCharacters<GenericString, GenericMax>;

export function maxCharacters<
	GenericString extends string,
	GenericMax extends number,
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

		return (string: string) => maxCharacters(string, max);
	}

	const [string, max] = args;

	return string.length <= max;
}

const source = "a" as
	| (string & MaxCharacters<2>)
	| (string & MaxCharacters<5>)
	| (string & LengthEqual<4>)
	| (string & MinCharacters<2>)
	| (string & MinCharacters<5>);

if (maxCharacters(source, 3)) {
	type check = DCommon.ExpectType<
		typeof source,
		| (string & MaxCharacters<2>)
		| (string & MaxCharacters<5> & MaxCharacters<3>)
		| (string & MinCharacters<2> & MaxCharacters<3>),
		"strict"
	>;
} else {
	type check = DCommon.ExpectType<
		typeof source,
		| (string & MaxCharacters<5>)
		| (string & LengthEqual<4>)
		| (string & MinCharacters<2>)
		| (string & MinCharacters<5>),
		"strict"
	>;
}
