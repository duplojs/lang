import type { Absolute, Path } from "./constraints";
import { fix } from "./fix";

export function computeRelative<
	GenericSourcePath extends string & Path & Absolute,
	GenericDestinationPath extends string & Path & Absolute,
>(
	source: GenericSourcePath,
	destination: GenericDestinationPath,
): string & Path;

export function computeRelative(
	source: string,
	destination: string,
): string {
	const sourceSegments = fix(source).split("/");
	const destinationSegments = fix(destination).split("/");

	let commonIndex = 1;

	while (
		commonIndex < sourceSegments.length
		&& commonIndex < destinationSegments.length
		&& sourceSegments[commonIndex] === destinationSegments[commonIndex]
	) {
		commonIndex++;
	}

	let result = "";

	for (let index = commonIndex; index < sourceSegments.length; index++) {
		result += result === ""
			? ".."
			: "/..";
	}

	for (let index = commonIndex; index < destinationSegments.length; index++) {
		result += result === ""
			? destinationSegments[index]
			: `/${destinationSegments[index]}`;
	}

	return result || ".";
}
