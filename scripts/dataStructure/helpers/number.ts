import { type Constraint } from "../constraint";
import { TypeStructure } from "../structure";
import { NumberType } from "../type";

export function number<
	GenericConstraints extends readonly Constraint<number>[] = readonly [],
>(
	constraints: GenericConstraints = [] as never,
) {
	return TypeStructure(
		NumberType(),
		constraints,
	);
}
