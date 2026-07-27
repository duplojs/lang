import type { ReapplyAllSizeConstraints } from "./constraints";
import type { Join } from "./types";

type ConcatOutput<
	GenericString extends string,
	GenericElement extends string,
	GenericElementsRest extends readonly string[] = [],
> = ReapplyAllSizeConstraints<
	GenericString,
	`${GenericString}${GenericElement}${Join<GenericElementsRest>}`,
	"lengthEqual" | "maxCharacters"
>;

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
