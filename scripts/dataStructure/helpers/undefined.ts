import { type Constraint } from "../constraint";
import { TypeStructure } from "../structure";
import { UndefinedType } from "../type";

function undefinedHelper<
	GenericConstraints extends readonly Constraint<undefined>[] = readonly [],
>(
	constraints: GenericConstraints = [] as never,
) {
	return TypeStructure(
		UndefinedType(),
		constraints,
	);
}

export { undefinedHelper as undefined };
