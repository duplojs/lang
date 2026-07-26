import { type Constraint } from "../constraint";
import { TypeStructure } from "../structure";
import { BooleanType } from "../type";

export function boolean<
	GenericConstraints extends readonly Constraint<boolean>[] = readonly [],
>(
	constraints: GenericConstraints = [] as never,
) {
	return TypeStructure(
		BooleanType(),
		constraints,
	);
}
