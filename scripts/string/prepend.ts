import type { ReapplyAllSizeConstraints } from "./constraints";
import type { Join } from "./types";

type PrependOutput<
	GenericString extends string,
	GenericElement extends string,
	GenericElementsRest extends readonly string[] = [],
> = ReapplyAllSizeConstraints<
	GenericString,
	`${GenericElement}${Join<GenericElementsRest>}${GenericString}`,
	"lengthEqual" | "maxCharacters"
>;

export function prepend<
	GenericElement extends string,
>(
	element: GenericElement,
): <GenericString extends string>(
	string: GenericString,
) => PrependOutput<GenericString, GenericElement>;

export function prepend<
	GenericString extends string,
	GenericElement extends string,
	GenericElementsRest extends readonly string[],
>(
	string: GenericString,
	element: GenericElement,
	...elementsRest: GenericElementsRest
): PrependOutput<GenericString, GenericElement, GenericElementsRest>;

export function prepend(
	...args:
		| [element: string]
		| [string: string, element: string, ...elementsRest: string[]]
) {
	if (args.length === 1) {
		const [element] = args;

		return (string: string) => prepend(string, element);
	}

	const [string, element, ...elementsRest] = args as [
		string,
		string,
		...string[],
	];

	return element.concat(...elementsRest, string);
}
