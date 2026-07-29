import type * as DCommon from "@scripts/common";
import type { ReapplyAllSizeConstraints } from "./constraints";
import type { Join } from "./types";

type RemoveStringConstraints<
	GenericStrings extends readonly string[],
> = GenericStrings extends readonly []
	? []
	: GenericStrings extends readonly [
		infer InferredHead extends string,
		...infer InferredRest extends readonly string[],
	]
		? [
			DCommon.RemoveConstraint<InferredHead> extends infer InferredString extends string
				? InferredString
				: never,
			...RemoveStringConstraints<InferredRest>,
		]
		: string[];

type ConcatOutput<
	GenericString extends string,
	GenericElement extends string,
	GenericElementsRest extends readonly string[] = [],
> = DCommon.RemoveConstraint<GenericString> extends infer InferredString extends string
	? DCommon.RemoveConstraint<GenericElement> extends infer InferredElement extends string
		? ReapplyAllSizeConstraints<
			GenericString,
			`${InferredString}${InferredElement}${Join<RemoveStringConstraints<GenericElementsRest>>}`,
			"lengthEqual" | "maxCharacters"
		>
		: never
	: never;

export function concat<
	GenericElement extends string,
>(
	element: GenericElement,
): <GenericString extends string>(
	string: GenericString,
) => ConcatOutput<GenericString, GenericElement>;

export function concat<
	GenericString extends string,
	GenericElement extends string,
	GenericElementsRest extends readonly string[],
>(
	string: GenericString,
	element: GenericElement,
	...elementsRest: GenericElementsRest
): ConcatOutput<GenericString, GenericElement, GenericElementsRest>;

export function concat(
	...args:
		| [element: string]
		| [string: string, element: string, ...elementsRest: string[]]
) {
	if (args.length === 1) {
		const [element] = args;

		return (string: string) => concat(string, element);
	}

	const [string, element, ...elementsRest] = args as [
		string,
		string,
		...string[],
	];

	return string.concat(element, ...elementsRest);
}
