import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import type { LengthEqual, MaxCharacters, MinCharacters } from "./constraints";

type RequireLengthEqualConstraint<
	GenericString extends string,
	GenericMin extends number,
> = GenericString extends LengthEqual<infer InferredLength>
	? DNumber.IsGreaterOrEqual<InferredLength, GenericMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MinCharacters<${GenericMin}> on LengthEqual<${InferredLength}>.`
		>
	: unknown;

type RequireMaxCharactersConstraint<
	GenericString extends string,
	GenericMin extends number,
> = GenericString extends MaxCharacters<infer InferredMax>
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
	& RequireLengthEqualConstraint<GenericString, GenericMin>
	& RequireMaxCharactersConstraint<GenericString, GenericMin>
);

type ComputeMinCharacters<
	GenericString extends string,
	GenericMin extends number,
> = GenericString extends LengthEqual<infer InferredLength>
	? DNumber.IsGreaterOrEqual<InferredLength, GenericMin> extends true
		? GenericString
		: never
	: GenericString extends MaxCharacters<infer InferredMax>
		? DNumber.IsGreaterOrEqual<InferredMax, GenericMin> extends true
			? GenericString & MinCharacters<GenericMin>
			: never
		: GenericString extends MinCharacters<infer InferredMin>
			? DNumber.IsGreaterOrEqual<InferredMin, GenericMin> extends true
				? GenericString
				: GenericString & MinCharacters<GenericMin>
			: GenericString & MinCharacters<GenericMin>;

export function minCharacters<
	GenericString extends string,
	GenericMin extends number,
>(
	min: GenericMin & RequireApplyMinCharacters<GenericString, GenericMin>,
): (
	string: GenericString,
) => string is ComputeMinCharacters<GenericString, GenericMin>;

export function minCharacters<
	GenericString extends string,
	GenericMin extends number,
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

		return (string: string) => minCharacters(string, min);
	}

	const [string, min] = args;

	return string.length >= min;
}

const source = "a" as
	| (string & MinCharacters<2>)
	| (string & MinCharacters<5>)
	| (string & LengthEqual<4>)
	| (string & MaxCharacters<2>)
	| (string & MaxCharacters<5>);

if (minCharacters(source, 3)) {
	type check = DCommon.ExpectType<
		typeof source,
		| (string & MinCharacters<5>)
		| (string & MinCharacters<2> & MinCharacters<3>)
		| (string & LengthEqual<4>)
		| (string & MaxCharacters<5> & MinCharacters<3>),
		"strict"
	>;
} else {
	type check = DCommon.ExpectType<
		typeof source,
		| (string & MinCharacters<2>)
		| (string & MaxCharacters<2>)
		| (string & MaxCharacters<5>),
		"strict"
	>;
}
