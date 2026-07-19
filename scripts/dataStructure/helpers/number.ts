import { TypeStructure } from "../structure";
import { NumberType } from "../type";

export function number() {
	return TypeStructure(
		NumberType(),
	);
}
