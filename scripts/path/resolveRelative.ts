import type { Path } from "./constraints";
import type { RequireSegments } from "./types";

const segmentTrailingRegex = /\/$/;
const segmentRelativeRegex = /^(.\/)/;

export function resolveRelative<
	const GenericSegments extends readonly (string & Path)[],
>(
	segments: GenericSegments & RequireSegments<GenericSegments>,
): string & Path;

export function resolveRelative(
	segments: readonly string[],
): string {
	let clearedPath = "";

	for (const segment of segments) {
		if (segment.length === 0) {
			continue;
		} else if (segment === "/") {
			clearedPath = segment;
			continue;
		}

		const formattedSegment = segment
			.replace(segmentTrailingRegex, "")
			.replace(segmentRelativeRegex, "");

		if (formattedSegment.startsWith("/") || clearedPath === "") {
			clearedPath = formattedSegment;
		} else if (clearedPath === "/") {
			clearedPath += formattedSegment;
		} else {
			clearedPath += `/${formattedSegment}`;
		}
	}

	const dotResult: ".."[] = [];
	const result: string[] = [];

	for (const element of clearedPath.split("/")) {
		if (element === "..") {
			const deletedElement = result.pop();

			if (!deletedElement) {
				dotResult.push(element);
			}
		} else {
			result.push(element);
		}
	}

	if (dotResult.length === 0) {
		return result.join("/");
	}

	return `${dotResult.join("/")}/${result.join("/")}`;
}
