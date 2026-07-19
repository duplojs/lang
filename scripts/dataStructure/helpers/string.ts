import { TypeStructure } from "../structure";
import { StringType } from "../type";

export function string() {
	return TypeStructure(
		StringType(),
	);
}
