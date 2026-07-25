import type * as DChrono from "@scripts/chrono";
import { type Constraint } from "../constraint";
import { TypeStructure } from "../structure";
import { TimeType } from "../type";

export function time<
	GenericConstraints extends readonly Constraint<DChrono.TheTime>[] = readonly [],
>(
	constraints: GenericConstraints = [] as never,
) {
	return TypeStructure(
		TimeType(),
		constraints,
	);
}
