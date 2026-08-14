import type { Absolute, Path } from "./constraints";
import { resolveRelative } from "./resolveRelative";
import type { RequireSegments } from "./types";

const aboveRootRegex = /^(?:\.\.\/)+/;

export function resolveFrom<
	const GenericSegments extends readonly (string & Path)[],
>(
	origin: string & Path & Absolute,
	segments: GenericSegments & RequireSegments<GenericSegments>,
): string & Path & Absolute;

export function resolveFrom(
	origin: string,
	segments: readonly string[],
): string & Path & Absolute {
	const result = resolveRelative([origin as string & Path, ...segments as never[]]);

	if (!result.startsWith("../")) {
		return result as string & Path & Absolute;
	}

	return `/${result.replace(aboveRootRegex, "")}` as string & Path & Absolute;
}
