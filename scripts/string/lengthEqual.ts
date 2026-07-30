import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import type { LengthEqual, MaxCharacters, MinCharacters } from "./constraints";

type RequireLengthEqualConstraint<
	GenericString extends string,
	GenericLength extends number,
> = GenericString extends LengthEqual<infer InferredLength>
	? DCommon.IsEqual<GenericLength, InferredLength> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply LengthEqual<${GenericLength}> on LengthEqual<${InferredLength}>.`
		>
	: unknown;

type RequireMinCharactersConstraint<
	GenericString extends string,
	GenericLength extends number,
> = GenericString extends MinCharacters<infer InferredMin>
	? DNumber.IsGreaterOrEqual<GenericLength, InferredMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply LengthEqual<${GenericLength}> on MinCharacters<${InferredMin}>.`
		>
	: unknown;

type RequireMaxCharactersConstraint<
	GenericString extends string,
	GenericLength extends number,
> = GenericString extends MaxCharacters<infer InferredMax>
	? DNumber.IsGreaterOrEqual<InferredMax, GenericLength> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply LengthEqual<${GenericLength}> on MaxCharacters<${InferredMax}>.`
		>
	: unknown;

type RequireApplyLengthEqual<
	GenericString extends string,
	GenericLength extends number,
> = (
	& DNumber.ForbiddenNegative<GenericLength>
	& DNumber.RequireLiteralNumber<GenericLength>
	& RequireLengthEqualConstraint<GenericString, GenericLength>
	& RequireMinCharactersConstraint<GenericString, GenericLength>
	& RequireMaxCharactersConstraint<GenericString, GenericLength>
);

type IsLengthEqualCompatible<
	GenericString extends string,
	GenericLength extends number,
> = DCommon.And<[
	GenericString extends LengthEqual<infer InferredLength>
		? DCommon.IsEqual<GenericLength, InferredLength>
		: true,
	GenericString extends MinCharacters<infer InferredMin>
		? DNumber.IsGreaterOrEqual<GenericLength, InferredMin>
		: true,
	GenericString extends MaxCharacters<infer InferredMax>
		? DNumber.IsGreaterOrEqual<InferredMax, GenericLength>
		: true,
]>;

type ComputeLengthEqual<
	GenericString extends string,
	GenericLength extends number,
> = GenericString extends unknown
	? IsLengthEqualCompatible<GenericString, GenericLength> extends true
		? GenericString & LengthEqual<GenericLength>
		: never
	: never;

export function lengthEqual<
	GenericString extends string,
	const GenericLength extends number,
>(
	length: GenericLength & RequireApplyLengthEqual<GenericString, GenericLength>,
): (
	string: GenericString,
) => string is ComputeLengthEqual<GenericString, GenericLength>;

export function lengthEqual<
	GenericString extends string,
	const GenericLength extends number,
>(
	string: GenericString,
	length: GenericLength & RequireApplyLengthEqual<GenericString, GenericLength>,
): string is ComputeLengthEqual<GenericString, GenericLength>;

export function lengthEqual(
	...args:
		| [length: number]
		| [string: string, length: number]
) {
	if (args.length === 1) {
		const [length] = args;

		return (string: string) => lengthEqual(string, length as never);
	}

	const [string, length] = args;

	return string.length === length;
}
