import { createStructure } from "../structure";
import { StringType } from "../type";

export function string() {
	return createStructure(
		StringType(),
	);
}
