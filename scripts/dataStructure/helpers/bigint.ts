import { TypeStructure } from "../structure";
import { BigintType } from "../type";

export function bigint() {
	return TypeStructure(
		BigintType(),
	);
}
